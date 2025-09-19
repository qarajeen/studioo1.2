
'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, UploadCloud, Copy, Check, Palette, CircleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const Loading = () => <Loader2 className="h-6 w-6 animate-spin text-primary" />;

function quantize(pixels: number[][], maxColors: number) {
    if (!pixels || pixels.length === 0 || maxColors < 2 || maxColors > 256) {
        return null;
    }

    const pixelCount = pixels.length;
    const sigbits = 5;
    const rshift = 8 - sigbits;
    const vbox = {
        r1: 0, r2: 255,
        g1: 0, g2: 255,
        b1: 0, b2: 255,
        histo: [] as number[],
    };

    const histo = new Int32Array(1 << (3 * sigbits));
    pixels.forEach(pixel => {
        const rval = pixel[0] >> rshift;
        const gval = pixel[1] >> rshift;
        const bval = pixel[2] >> rshift;
        const index = (rval << (2 * sigbits)) + (gval << sigbits) + bval;
        histo[index] = (histo[index] || 0) + 1;
    });

    const fractByPopulations: number[] = [];
    histo.forEach(val => {
        if(val > 0) fractByPopulations.push(Math.sqrt(val));
    });

    // Simple implementation: just take the most prominent colors. A full median cut algorithm is more complex.
    const sortedHisto = [];
    for(let i=0; i< histo.length; i++) {
        if (histo[i] > 0) {
            const bval = i & ((1 << sigbits) - 1);
            const gval = (i >> sigbits) & ((1 << sigbits) - 1);
            const rval = (i >> (2 * sigbits)) & ((1 << sigbits) - 1);
            sortedHisto.push({
                color: [rval << rshift, gval << rshift, bval << rshift],
                count: histo[i]
            })
        }
    }

    sortedHisto.sort((a,b) => b.count - a.count);
    
    return sortedHisto.slice(0, maxColors).map(item => item.color);
}


function getPalette(img: HTMLImageElement, colorCount = 8) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const width = canvas.width = img.width;
    const height = canvas.height = img.height;

    ctx.drawImage(img, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;
    const pixels: number[][] = [];
    for (let i = 0; i < data.length; i += 4 * 10) { // quality = 10
        pixels.push([data[i], data[i+1], data[i+2]]);
    }
    
    const cmap = quantize(pixels, colorCount);
    if (!cmap) return null;

    return cmap.map(color => {
        const [r, g, b] = color;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    });
}


function PaletteDisplay({ imagePreview, onCopy, copiedColor }: { imagePreview: string; onCopy: (color: string) => void; copiedColor: string | null }) {
    const [colorPalette, setColorPalette] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (!imagePreview) return;
        setLoading(true);
        const img = document.createElement('img');
        img.src = imagePreview;
        img.onload = () => {
            const palette = getPalette(img, 8);
            setColorPalette(palette);
            setLoading(false);
        }
        img.onerror = () => {
            setLoading(false);
        }
    }, [imagePreview]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-24"><Loading/></div>
        );
    }
    
    if (!colorPalette) {
        return (
            <div className="flex items-center justify-center h-24 text-muted-foreground">Could not extract palette.</div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colorPalette?.map((color, index) => (
                <div key={index} className="space-y-2 group">
                    <div style={{ backgroundColor: color }} className="h-24 w-full rounded-lg shadow-md border border-white/20"/>
                    <Button variant="secondary" size="sm" onClick={() => onCopy(color)} className="w-full text-sm">
                        {copiedColor === color ? <Check className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                        <span className="font-mono ml-2">{color}</span>
                    </Button>
                </div>
            ))}
        </div>
    );
}


export function ColorPaletteGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError("Please upload a valid image file (JPEG, PNG, GIF) under 10MB.");
      setFile(null);
      setImagePreview(null);
      return;
    }
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/gif': [] },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast({ title: 'Copied!', description: `${color} copied to your clipboard.` });
    setTimeout(() => setCopiedColor(null), 2000);
  };
  
  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Palette className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Color Palette Generator</CardTitle>
        <CardDescription>Upload an image to extract its dominant colors.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        {!file && (
          <div
            {...getRootProps()}
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Drag & drop an image here</p>
            <p className="text-muted-foreground">or click to select a file</p>
          </div>
        )}

        {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-destructive-foreground bg-destructive p-3 rounded-md">
                <CircleAlert className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}

        {imagePreview && (
          <div className="space-y-8 mt-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <Image src={imagePreview} alt="Uploaded preview" width={300} height={300} className="rounded-lg mx-auto shadow-lg object-contain" />
              </div>
              <div className="w-full md:w-2/3">
                 <h3 className="font-semibold text-lg mb-4 text-center md:text-left">Extracted Palette</h3>
                 <PaletteDisplay imagePreview={imagePreview} onCopy={handleCopy} copiedColor={copiedColor} />
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => { setFile(null); setImagePreview(null); }} variant="outline">
                Upload a Different Image
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
