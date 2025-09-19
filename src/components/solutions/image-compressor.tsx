
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Download, UploadCloud, ArrowRight, CircleAlert, Shrink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

export function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedImageUri, setCompressedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const { toast } = useToast();

  useEffect(() => {
    // Re-compress when quality changes
    if (originalPreview) {
      handleCompress();
    }
  }, [quality, originalPreview]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setCompressedImageUri(null);
    if (fileRejections.length > 0) {
      setError("Please upload a valid JPEG or PNG file under 10MB.");
      setOriginalFile(null);
      setOriginalPreview(null);
      return;
    }
    const file = acceptedFiles[0];
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setOriginalPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleCompress = async () => {
    if (!originalPreview || !originalFile) return;
    setIsLoading(true);
    setError(null);

    const image = document.createElement('img');
    image.src = originalPreview;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError("Could not get canvas context. Your browser might be too old.");
        setIsLoading(false);
        return;
      }
      ctx.drawImage(image, 0, 0);
      
      try {
        const mimeType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUri = canvas.toDataURL(mimeType, quality);
        setCompressedImageUri(compressedDataUri);
      } catch (e) {
        console.error(e);
        setError("An error occurred during compression. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    image.onerror = () => {
        setError("Could not load the image file.");
        setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImageUri) return;
    const link = document.createElement('a');
    link.href = compressedImageUri;
    const fileExtension = originalFile?.type === 'image/png' ? '.png' : '.jpg';
    const fileName = originalFile?.name.replace(/\.(jpg|jpeg|png)$/i, `-compressed${fileExtension}`) || `compressed${fileExtension}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getFileSize = (dataUri: string) => {
    if (!dataUri) return 0;
    // For PNGs, base64 length is not a good indicator of file size due to compression.
    // This is a rough estimate. For more accuracy, a Blob would be needed.
    const base64 = dataUri.split(',')[1];
    if (!base64) return 0;
    return Math.round((base64.length * 3) / 4 / 1024); // in KB
  }

  const originalSize = originalPreview ? getFileSize(originalPreview) : 0;
  const compressedSize = compressedImageUri ? getFileSize(compressedImageUri) : 0;
  const sizeReduction = originalSize > 0 && compressedSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Shrink className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Image Compressor</CardTitle>
        <CardDescription>Optimize your JPEG or PNG images. Adjust the quality to find the perfect balance.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        {!originalFile && (
          <div
            {...getRootProps()}
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Drag & drop a JPEG or PNG here</p>
            <p className="text-muted-foreground">or click to select a file (Max 10MB)</p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-destructive-foreground bg-destructive p-3 rounded-md">
            <CircleAlert className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {originalFile && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="text-center">
                 <h3 className="font-semibold mb-2">Original Image</h3>
                 {originalPreview && <Image src={originalPreview} alt="Original" width={300} height={300} className="rounded-lg mx-auto shadow-md object-contain" />}
                 <p className="text-sm text-muted-foreground mt-2">{originalFile.name} (~{originalSize} KB)</p>
              </div>
               <div className="text-center">
                <h3 className="font-semibold mb-2">Compressed Image</h3>
                {isLoading && !compressedImageUri ? (
                    <div className="w-full h-[300px] mx-auto flex flex-col items-center justify-center bg-muted rounded-lg shadow-md">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-sm text-muted-foreground">Compressing...</p>
                    </div>
                ) : compressedImageUri ? (
                    <>
                        <Image src={compressedImageUri} alt="Compressed" width={300} height={300} className="rounded-lg mx-auto shadow-md object-contain" />
                        <p className="text-sm text-muted-foreground mt-2">
                            {`~${compressedSize} KB`}
                            {sizeReduction > 0 && <span className="font-bold text-green-500 ml-2">({sizeReduction.toFixed(0)}% smaller)</span>}
                        </p>
                    </>
                ) : (
                    <div className="w-full h-[300px] mx-auto flex items-center justify-center bg-muted rounded-lg shadow-md">
                        <p className="text-muted-foreground">Adjust quality to compress</p>
                    </div>
                )}
               </div>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="quality" className="mb-2 block text-center">Quality: {Math.round(quality * 100)}%</Label>
                  <Slider
                    id="quality"
                    value={[quality]}
                    onValueChange={(val) => setQuality(val[0])}
                    min={0.1}
                    max={1}
                    step={0.05}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => { setOriginalFile(null); setOriginalPreview(null); setCompressedImageUri(null); }} variant="outline">
                    Choose New Image
                  </Button>
                  <Button onClick={handleDownload} disabled={!compressedImageUri || isLoading} size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
