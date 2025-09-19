
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { jpegToWebp, JpegToWebpOutput } from '@/ai/flows/jpeg-to-webp-flow';
import { Loader2, Download, UploadCloud, FileImage, ArrowRight, CircleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function JpegToWebpConverter() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<JpegToWebpOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setConvertedImage(null);
    if (fileRejections.length > 0) {
      setError("Please upload a valid JPEG file under 5MB.");
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
    accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleConvert = async () => {
    if (!originalPreview) return;
    setIsLoading(true);
    setError(null);
    setConvertedImage(null);

    try {
      const result = await jpegToWebp({ imageDataUri: originalPreview });
      setConvertedImage(result);
      toast({
        title: "Conversion Successful!",
        description: "Your image has been converted to WEBP.",
      });
    } catch (e) {
      console.error(e);
      setError("An error occurred during conversion. Please try again.");
      toast({
        title: "Conversion Failed",
        description: "Something went wrong. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage?.webpDataUri) return;
    const link = document.createElement('a');
    link.href = convertedImage.webpDataUri;
    const fileName = originalFile?.name.replace(/\.(jpg|jpeg)$/i, '.webp') || 'converted.webp';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getFileSize = (dataUri: string) => {
    if (!dataUri) return 0;
    // Base64 encoding adds about 33% to the file size
    const base64 = dataUri.split(',')[1];
    return Math.round((base64.length * 3) / 4 / 1024); // in KB
  }

  const originalSize = originalPreview ? getFileSize(originalPreview) : 0;
  const convertedSize = convertedImage?.webpDataUri ? getFileSize(convertedImage.webpDataUri) : 0;
  const sizeReduction = originalSize > 0 ? ((originalSize - convertedSize) / originalSize) * 100 : 0;

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <FileImage className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">JPEG to WEBP Converter</CardTitle>
        <CardDescription>Optimize your images for the web by converting them to the modern WEBP format.</CardDescription>
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
            <p className="mt-4 text-lg font-semibold">Drag & drop a JPEG file here</p>
            <p className="text-muted-foreground">or click to select a file (Max 5MB)</p>
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
                 <h3 className="font-semibold mb-2">Original JPEG</h3>
                 {originalPreview && <Image src={originalPreview} alt="Original" width={300} height={300} className="rounded-lg mx-auto shadow-md" />}
                 <p className="text-sm text-muted-foreground mt-2">{originalFile.name} ({originalSize} KB)</p>
              </div>
               <div className="text-center">
                <h3 className="font-semibold mb-2">Converted WEBP</h3>
                {isLoading ? (
                    <div className="w-[300px] h-[300px] mx-auto flex flex-col items-center justify-center bg-muted rounded-lg shadow-md">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-sm text-muted-foreground">Converting...</p>
                    </div>
                ) : convertedImage ? (
                    <>
                        <Image src={convertedImage.webpDataUri} alt="Converted" width={300} height={300} className="rounded-lg mx-auto shadow-md" />
                        <p className="text-sm text-muted-foreground mt-2">
                            {originalFile.name.replace(/\.(jpg|jpeg)$/i, '.webp')} ({convertedSize} KB)
                            <span className="font-bold text-green-500 ml-2">({sizeReduction.toFixed(0)}% smaller)</span>
                        </p>
                    </>
                ) : (
                    <div className="w-[300px] h-[300px] mx-auto flex items-center justify-center bg-muted rounded-lg shadow-md">
                        <p className="text-muted-foreground">Awaiting conversion...</p>
                    </div>
                )}
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => { setOriginalFile(null); setOriginalPreview(null); setConvertedImage(null); }} variant="outline">
                Upload a Different File
              </Button>
              {!convertedImage && (
                <Button onClick={handleConvert} disabled={isLoading} size="lg">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  Convert to WEBP
                </Button>
              )}
              {convertedImage && (
                 <Button onClick={handleDownload} size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download WEBP
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
