
'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, Camera, CircleAlert, Aperture, LucideRefreshCw, Shutter, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import ExifReader from 'exif-reader';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

// Helper to format tag values
const formatValue = (key: string, value: any): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    
    if (key.toLowerCase().includes('shutterspeed')) {
      if (typeof value === 'number' && value > 0) {
        if (value >= 1) return `${value}s`;
        return `1/${Math.round(1 / value)}s`;
      }
    }
    
    if (key.toLowerCase().includes('fnumber')) {
      return `f/${value}`;
    }

    if (key.toLowerCase().includes('datetime')) {
        try {
            return new Date(value).toLocaleString();
        } catch (e) {
            // ignore
        }
    }
  
    return String(value);
};


const tagCategories: Record<string, { name: string, icon: React.ReactNode, tags: string[] }> = {
    main: {
        name: 'Main Camera Settings',
        icon: <Camera className="w-5 h-5 text-primary" />,
        tags: ['FNumber', 'ExposureTime', 'ISOSpeedRatings', 'FocalLength', 'LensModel', 'Model', 'Make']
    },
    advanced: {
        name: 'Advanced Photographic Info',
        icon: <Aperture className="w-5 h-5 text-primary" />,
        tags: ['ExposureProgram', 'ExposureMode', 'MeteringMode', 'Flash', 'WhiteBalance', 'ShutterSpeedValue', 'ApertureValue']
    },
    lens: {
        name: 'Lens & Focus',
        icon: <ZoomIn className="w-5 h-5 text-primary" />,
        tags: ['FocalLengthIn35mmFormat', 'LensSpecification', 'LensMake', 'SubjectDistanceRange']
    },
    processing: {
        name: 'Image Processing',
        icon: <LucideRefreshCw className="w-5 h-5 text-primary" />,
        tags: ['ColorSpace', 'Contrast', 'Saturation', 'Sharpness', 'Software']
    }
};

const ExifDisplay = ({ tags }: { tags: Record<string, any> }) => {
    if (Object.keys(tags).length === 0) {
        return <p className="text-muted-foreground text-center">No EXIF data found in this image.</p>;
    }

    const allCategorizedTags = new Set(Object.values(tagCategories).flatMap(cat => cat.tags));
    const otherTags = Object.keys(tags).filter(tag => !allCategorizedTags.has(tag));

    return (
        <ScrollArea className="h-96 pr-4">
            <div className="space-y-6">
                {Object.entries(tagCategories).map(([key, category]) => {
                    const availableTags = category.tags.filter(tag => tags[tag] !== undefined);
                    if (availableTags.length === 0) return null;

                    return (
                        <div key={key}>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">{category.icon} {category.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {availableTags.map(tag => (
                                    <div key={tag} className="flex justify-between border-b border-border/50 py-1">
                                        <span className="text-muted-foreground">{tag}</span>
                                        <span className="font-medium text-right">{formatValue(tag, tags[tag])}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {otherTags.length > 0 && (
                     <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">Other Tags</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {otherTags.map(tag => (
                                <div key={tag} className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">{tag}</span>
                                    <span className="font-medium text-right">{formatValue(tag, tags[tag])}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export function ExifDataViewer() {
  const [file, setFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [exifData, setExifData] = React.useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    setExifData(null);
    if (fileRejections.length > 0) {
      setError("Please upload a valid image file (JPEG, PNG, GIF) under 10MB.");
      setFile(null);
      setImagePreview(null);
      return;
    }
    
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        const arrayBuffer = e.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
             try {
                const tags = ExifReader.load(arrayBuffer);
                // The library nests the actual tags, so we extract them.
                const allTags = { ...tags['Image'], ...tags['Exif'], ...tags['GPS'], ...tags['Interoperability'] };
                setExifData(allTags);
            } catch (err) {
                setError('Could not parse EXIF data from this image.');
                setExifData({}); // Set to empty object to show message
            }
        }
        setIsLoading(false);
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
    }
    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/tiff': [] },
    maxSize: 10 * 1024 * 1024, // 10MB
  });
  
  const handleReset = () => {
      setFile(null);
      setImagePreview(null);
      setExifData(null);
      setError(null);
  }

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Camera className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">EXIF Data Viewer</CardTitle>
        <CardDescription>Upload an image to view its metadata (e.g., camera settings, location).</CardDescription>
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

        {file && (
          <div className="space-y-8 mt-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0 space-y-4">
                 {imagePreview && <Image src={imagePreview} alt="Uploaded preview" width={300} height={300} className="rounded-lg mx-auto shadow-lg object-contain" />}
                 {isLoading && <Skeleton className="w-full h-64" />}
                 <p className="text-sm text-muted-foreground text-center">{file.name}</p>
              </div>
              <div className="w-full md:w-2/3">
                 <h3 className="font-semibold text-xl mb-4 text-center md:text-left">Image Metadata</h3>
                 {isLoading && <div className="space-y-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                 </div>}
                 {exifData && <ExifDisplay tags={exifData} />}
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleReset} variant="outline">
                Upload a Different Image
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
