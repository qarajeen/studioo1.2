
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, FileCode, CircleAlert, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

export function FileToDataUriConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setDataUri(null);
    setIsCopied(false);

    if (fileRejections.length > 0) {
      setError("File is too large. Please upload a file under 2MB.");
      setFile(null);
      return;
    }

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
        setDataUri(e.target?.result as string);
        toast({
          title: "Conversion Successful!",
          description: "Your file has been converted to a Data URI.",
        });
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        toast({
          title: "Conversion Failed",
          description: "The file could not be read. Please try again.",
          variant: "destructive",
        });
    };
    reader.readAsDataURL(uploadedFile);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  const handleCopy = () => {
    if (!dataUri) return;
    navigator.clipboard.writeText(dataUri);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <FileCode className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">File to Data URI Converter</CardTitle>
        <CardDescription>Instantly convert a file into a Data URI for easy embedding.</CardDescription>
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
            <p className="mt-4 text-lg font-semibold">Drag & drop any file here</p>
            <p className="text-muted-foreground">or click to select a file (Max 2MB)</p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-destructive-foreground bg-destructive p-3 rounded-md">
            <CircleAlert className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {file && (
          <div className="space-y-6 animate-fade-in-up">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">File Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div><strong className="text-muted-foreground">Name:</strong> {file.name}</div>
                    <div><strong className="text-muted-foreground">Type:</strong> {file.type}</div>
                    <div><strong className="text-muted-foreground">Size:</strong> {formatBytes(file.size)}</div>
                </CardContent>
            </Card>

            {dataUri && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="dataUriOutput" className="text-lg font-semibold">Generated Data URI</Label>
                    <Button onClick={handleCopy} size="sm" variant="ghost">
                        {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
                <Textarea
                  id="dataUriOutput"
                  readOnly
                  value={dataUri}
                  className="h-48 font-mono text-xs"
                  aria-label="Generated Data URI"
                />
              </div>
            )}
            
            <div className="flex justify-center">
              <Button onClick={() => { setFile(null); setDataUri(null); }} variant="outline">
                Convert Another File
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
