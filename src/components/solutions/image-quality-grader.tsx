
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeImageQuality, ImageQualityAnalysisOutput } from '@/ai/flows/analyze-image-quality-flow';
import Link from 'next/link';

import { Loader2, Search, ArrowRight, FileWarning, Image as ImageIcon, Maximize, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

const issueIcons: { [key: string]: React.ReactNode } = {
  'File Size': <FileWarning className="h-5 w-5 text-yellow-500" />,
  'Resolution': <Maximize className="h-5 w-5 text-blue-500" />,
  'Format': <ImageIcon className="h-5 w-5 text-purple-500" />,
  'Dimensions': <Maximize className="h-5 w-5 text-indigo-500" />,
};

const severityConfig = {
    'High': { icon: <XCircle className="h-5 w-5 text-red-500" /> },
    'Medium': { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" /> },
    'Low': { icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
}

export function ImageQualityGrader() {
  const [analysis, setAnalysis] = useState<ImageQualityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeImageQuality({ url: data.url });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Website Image Quality Grader</CardTitle>
        <CardDescription>Enter a URL to grade its image optimization and see how you can improve page speed.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                    <FormItem className="w-full">
                    <FormLabel className="sr-only">Website URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://your-website.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Grade Images
                </Button>
            </div>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">Analyzing images... this might take a moment.</p>
            </div>
        )}

        {error && (
            <div className="mt-8 text-center text-destructive">
                <p>{error}</p>
            </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            <Card className="bg-background/50">
                <CardHeader className="text-center">
                    <CardDescription>Overall Image Quality Score</CardDescription>
                    <CardTitle className={cn("text-7xl font-bold", scoreColor(analysis.overallScore))}>
                        {analysis.overallScore.toFixed(1)}<span className="text-4xl text-muted-foreground">/10</span>
                    </CardTitle>
                    <Progress value={analysis.overallScore * 10} className="w-full mt-2" />
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">{analysis.overallSummary}</p>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-xl font-bold mb-4">Image Breakdown</h3>
                <div className="space-y-4">
                    {analysis.imageBreakdown.map((image, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-background/30 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div className="md:col-span-1">
                                <div className='w-full aspect-video bg-muted rounded-md overflow-hidden relative'>
                                    <img src="https://picsum.photos/seed/1/400/200" alt={image.imageAlt} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30"></div>
                                    <p className="absolute bottom-2 left-2 text-white text-xs p-1 bg-black/50 rounded">{image.imageAlt}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                {image.issues.map((issue, issueIndex) => (
                                    <div key={issueIndex} className="flex items-start gap-3">
                                        <div className="pt-1">{issueIcons[issue.type]}</div>
                                        <div>
                                            <p className='font-semibold'>{issue.type} <span className="text-sm text-muted-foreground">({issue.severity} severity)</span></p>
                                            <p className="text-sm">{issue.description}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 bg-card rounded-md mt-2">
                                  <p className="font-semibold text-sm">Recommendation:</p>
                                  <p className="text-sm text-muted-foreground">{image.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Alert className="border-primary bg-primary/10">
              <AlertTitle className="font-bold">Boost Your Score & Speed</AlertTitle>
              <AlertDescription>
                <p>Professional photography isn't just about looks; it's about performance. We optimize every image for lightning-fast load times and SEO, ensuring your site is as fast as it is beautiful.</p>
                <Button asChild className="mt-4">
                    <Link href="/services">
                        Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
