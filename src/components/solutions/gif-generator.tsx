
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clapperboard, UploadCloud, Loader2, Download, CircleAlert, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function GifGenerator() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [generatedGif, setGeneratedGif] = useState<string | null>(null);
    const [trimRange, setTrimRange] = useState([0, 5]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Click "Generate GIF" to start.');
    const [error, setError] = useState<string | null>(null);
    
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            setError('Please upload a video file (MP4, WEBM, etc.) under 50MB.');
            return;
        }
        setError(null);
        setGeneratedGif(null);
        const file = acceptedFiles[0];
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': [] },
        maxSize: 50 * 1024 * 1024, // 50MB
    });

    const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const duration = e.currentTarget.duration;
        setVideoDuration(duration);
        const defaultEndTime = Math.min(duration, 5);
        setTrimRange([0, defaultEndTime]);
    };

    const loadFFmpeg = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg.loaded) return;
        
        setMessage('Loading FFmpeg core...');
        setProgress(0);
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress, time }) => {
            const p = progress * 100;
            setProgress(p);
            setMessage(`Processing... ${Math.round(p)}%`);
        });

        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'

        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
        });
        setMessage('FFmpeg loaded. Ready to generate.');
    };

    const generateGif = async () => {
        if (!videoFile) {
            toast({ title: "No Video Selected", description: "Please upload a video file first.", variant: "destructive" });
            return;
        }
        
        setIsLoading(true);
        setGeneratedGif(null);
        setError(null);

        try {
            await loadFFmpeg();
            
            const ffmpeg = ffmpegRef.current;
            const inputFileName = 'input.mp4';
            const outputFileName = 'output.gif';
            
            setMessage('Writing video file...');
            setProgress(0);
            await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

            const [startTime, endTime] = trimRange;
            const duration = endTime - startTime;

            setMessage('Generating GIF...');
            
            // High-quality palette generation command
            const paletteGenCommand = [
                '-i', inputFileName,
                '-ss', String(startTime),
                '-t', String(duration),
                '-vf', 'fps=15,scale=480:-1:flags=lanczos,palettegen',
                'palette.png'
            ];
            await ffmpeg.exec(paletteGenCommand);

            // GIF generation using the palette
            const gifGenCommand = [
                '-i', inputFileName,
                '-i', 'palette.png',
                '-ss', String(startTime),
                '-t', String(duration),
                '-filter_complex', 'fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse',
                outputFileName
            ];

            await ffmpeg.exec(gifGenCommand);
            
            setMessage('Finishing up...');
            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'image/gif' }));
            setGeneratedGif(url);
            
            toast({ title: "Success!", description: "Your GIF has been generated." });

        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred while generating the GIF.');
            toast({ title: "Error", description: "Failed to generate GIF. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setProgress(0);
            setMessage('Click "Generate GIF" to start.');
        }
    };
    
    return (
        <div className="w-full">
            <CardHeader className="px-0 pt-0 text-center">
                <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                    <Clapperboard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold mt-4">Animated GIF Generator</CardTitle>
                <CardDescription>Upload a short video clip to create a high-quality animated GIF.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 mt-8">
                {!videoSrc ? (
                    <div {...getRootProps()}
                        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-lg font-semibold">Drag & drop a video file</p>
                        <p className="text-muted-foreground">or click to select (Max 50MB)</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-full mx-auto">
                            <video ref={videoRef} src={videoSrc} controls className="w-full rounded-lg" onLoadedMetadata={handleVideoLoad} />
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Trim Video ({formatTime(trimRange[0])} - {formatTime(trimRange[1])})</Label>
                            <Slider
                                value={trimRange}
                                onValueChange={setTrimRange}
                                min={0}
                                max={videoDuration}
                                step={0.1}
                                minStepsBetweenThumbs={1}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => setVideoSrc(null)} variant="outline">Choose Different Video</Button>
                            <Button onClick={generateGif} disabled={isLoading} size="lg">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />}
                                Generate GIF
                            </Button>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-destructive-foreground bg-destructive p-3 rounded-md">
                        <CircleAlert className="h-5 w-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {isLoading && (
                    <div className="mt-6 text-center space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground">{message}</p>
                    </div>
                )}

                {generatedGif && (
                    <div className="mt-8 space-y-4 text-center animate-fade-in-up">
                        <CardHeader className="p-0">
                           <CardTitle>Your Generated GIF</CardTitle>
                        </CardHeader>
                        <img src={generatedGif} alt="Generated GIF" className="rounded-lg mx-auto shadow-lg max-w-full" />
                        <Button asChild size="lg">
                            <a href={generatedGif} download={`${videoFile?.name.split('.')[0]}.gif`}>
                                <Download className="mr-2 h-4 w-4"/>
                                Download GIF
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </div>
    );
}
