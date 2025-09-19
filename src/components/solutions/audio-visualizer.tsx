
'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, Music, CircleAlert, Loader2, Video, Download, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export function AudioVisualizer() {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'analyzing' | 'ready' | 'recording' | 'processing' | 'finished'>('idle');
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const sourceRef = React.useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordedChunksRef = React.useRef<Blob[]>([]);

  const cleanup = React.useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (sourceRef.current) {
        try {
            sourceRef.current.stop();
        } catch (e) {}
        sourceRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    mediaRecorderRef.current = null;
  }, []);
  
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    cleanup();
    setError(null);
    setFile(null);
    setStatus('idle');
    setVideoUrl(null);
    
    if (fileRejections.length > 0) {
      setError("Please upload a valid audio file (e.g., MP3, WAV) under 15MB.");
      return;
    }

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setStatus('analyzing');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination); // So we can hear it
        sourceRef.current = source;
        
        setStatus('ready');
        toast({ title: 'Audio ready!', description: "Press 'Record Video' to start." });
      } catch (err) {
        setError('Failed to decode audio file. It might be corrupt or an unsupported format.');
        setStatus('idle');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, [toast, cleanup]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] },
    maxSize: 15 * 1024 * 1024, // 15MB
  });
  
  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 1.5;
      
      const g = 100 + (barHeight / 2);
      const b = 150 + barHeight;

      ctx.fillStyle = `rgb(80, ${g}, ${b})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
    
    animationFrameRef.current = requestAnimationFrame(draw);
  }, []);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (sourceRef.current) {
        try {
           sourceRef.current.stop();
        } catch (e) {
            console.warn("Audio source could not be stopped, it might have already finished.", e);
        }
    }
  };

  const startRecording = () => {
    if (status !== 'ready' || !canvasRef.current || !audioContextRef.current || !sourceRef.current) return;
    
    setStatus('recording');
    setVideoUrl(null);
    recordedChunksRef.current = [];

    const canvasStream = canvasRef.current.captureStream(30); // 30 FPS
    const audioDestination = audioContextRef.current.createMediaStreamDestination();
    sourceRef.current.connect(audioDestination);
    
    const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
    ]);
    
    mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
    
    mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
        }
    };

    mediaRecorderRef.current.onstop = () => {
      setStatus('processing');
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus('finished');
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    sourceRef.current.onended = () => {
        // This will be called naturally when the audio finishes, or when we call stop()
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    sourceRef.current.start(0);
    mediaRecorderRef.current.start();
    draw();
  };

  const handleReset = () => {
    cleanup();
    setFile(null);
    setError(null);
    setStatus('idle');
    setVideoUrl(null);
  };
  
  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Music className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Simple Audio Visualizer</CardTitle>
        <CardDescription>Upload an audio file to generate a simple video visualizer.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        {status === 'idle' && (
          <div
            {...getRootProps()}
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Drag & drop an audio file here</p>
            <p className="text-muted-foreground">or click to select a file (Max 15MB)</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-destructive-foreground bg-destructive p-3 rounded-md">
            <CircleAlert className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {(status !== 'idle') && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-center">
                <canvas ref={canvasRef} width="640" height="360" className="rounded-lg bg-black shadow-lg w-full max-w-2xl aspect-video"></canvas>
            </div>
            
            {status === 'analyzing' && <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p>Analyzing audio...</p></div>}

            {file && (
                <div className="text-center text-muted-foreground">
                    <Label>Loaded File</Label>
                    <p className="font-semibold text-foreground">{file.name}</p>
                </div>
            )}
            
            {status === 'ready' && (
              <div className="flex justify-center">
                <Button onClick={startRecording} size="lg">
                  <Video className="mr-2 h-5 w-5" />
                  Record Video
                </Button>
              </div>
            )}
            
            {status === 'recording' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Recording...
                    </div>
                    <Button onClick={stopRecording} variant="destructive" size="lg">
                        <StopCircle className="mr-2 h-5 w-5" />
                        Stop
                    </Button>
                </div>
            )}
            
            {(status === 'processing' || status === 'finished') && (
              <div className="space-y-4 text-center">
                {status === 'processing' && <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p>Processing video...</p></div>}
                
                {status === 'finished' && videoUrl && (
                  <div className="space-y-4">
                     <p className="text-lg font-semibold text-green-400">Video generation complete!</p>
                     <video src={videoUrl} controls className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"></video>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <a href={videoUrl} download={`${file?.name.split('.')[0] || 'visualizer'}.webm`}>
                                <Download className="mr-2 h-5 w-5" />
                                Download Video
                            </a>
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Create Another
                        </Button>
                     </div>
                  </div>
                )}
              </div>
            )}

            {(status === 'ready' || status === 'recording') && (
              <div className="flex justify-center pt-4">
                <Button onClick={handleReset} variant="link" className="text-muted-foreground">Cancel</Button>
              </div>
            )}

          </div>
        )}
      </CardContent>
    </div>
  );
}
