
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { pngToSvg } from '@/ai/flows/png-to-svg-flow';
import { Loader2, UploadCloud, FileType, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PngToSvgConverter() {
  const [pngFile, setPngFile] = useState<File | null>(null);
  const [pngPreview, setPngPreview] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'image/png') {
        setPngFile(file);
        setSvgString(null);
        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
          setPngPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Please upload a PNG file.");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false
  });

  const handleConvert = async () => {
    if (!pngPreview) return;
    setIsLoading(true);
    setError(null);
    setSvgString(null);

    try {
      const result = await pngToSvg({ imageDataUri: pngPreview });
      setSvgString(result.svgString);
    } catch (e) {
      console.error(e);
      setError("An error occurred during conversion. The AI may not be able to process this image. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pngFile?.name.replace('.png', '')}.svg` || 'converted.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleClear = () => {
    setPngFile(null);
    setPngPreview(null);
    setSvgString(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">PNG to SVG Converter</CardTitle>
        <CardDescription>Upload a PNG to convert it into a scalable vector graphic (SVG) using AI.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-6">
        {!pngPreview ? (
          <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors", isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {isDragActive ? "Drop the PNG file here" : "Drag & drop a PNG file here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Maximum file size 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Original PNG</h3>
                    <div className="relative border rounded-lg p-4 bg-background/50 flex items-center justify-center min-h-[200px]">
                        <Image src={pngPreview} alt="PNG Preview" width={200} height={200} className="max-w-full h-auto rounded-md" />
                         <Button variant="ghost" size="icon" onClick={handleClear} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Converted SVG</h3>
                    <div className="border rounded-lg p-4 bg-white flex items-center justify-center min-h-[200px]">
                        {isLoading ? (
                            <div className="text-center">
                                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
                                <p className="mt-4 text-muted-foreground">Converting...</p>
                            </div>
                        ) : svgString ? (
                            <div dangerouslySetInnerHTML={{ __html: svgString }} className="max-w-full h-auto" style={{maxWidth: 200, maxHeight: 200}} />
                        ) : (
                             <div className="text-center text-muted-foreground">
                                <FileType className="mx-auto h-12 w-12" />
                                <p className="mt-4">Your SVG will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && <p className="text-destructive text-center">{error}</p>}
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleConvert} disabled={isLoading || !pngPreview} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileType className="mr-2 h-4 w-4" />}
                    Convert to SVG
                </Button>
                <Button onClick={handleDownload} disabled={!svgString} variant="secondary" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download SVG
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
