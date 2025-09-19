
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useColorThief from 'color-thief-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, UploadCloud, Copy, Check, Palette, CircleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const Loading = () => <Loader2 className="h-6 w-6 animate-spin text-primary" />;

export function ColorPaletteGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: colorPalette, loading: paletteLoading } = useColorThief(imagePreview, {
    format: 'hex',
    colorCount: 8,
    quality: 10,
  });

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
  
  function getTextColor(hex: string): 'text-black' | 'text-white' {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'text-black' : 'text-white';
  }

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
                 {paletteLoading && <div className="flex items-center justify-center h-24"><Loading/></div>}
                 {colorPalette && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {colorPalette.map((color, index) => (
                            <div key={index} className="space-y-2 group">
                                <div style={{ backgroundColor: color }} className="h-24 w-full rounded-lg shadow-md border border-white/20"/>
                                <Button variant="secondary" size="sm" onClick={() => handleCopy(color)} className="w-full text-sm">
                                    {copiedColor === color ? <Check className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                                    <span className="font-mono ml-2">{color}</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                 )}
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
