
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, Timer, Pointer, ChevronsDownUp, Smartphone, Monitor } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  deviceType: z.enum(['desktop', 'mobile']),
});

type FormValues = z.infer<typeof formSchema>;

type Metric = {
    name: string;
    value: number | null;
    rating: 'Good' | 'Needs Improvement' | 'Poor' | null;
    explanation: string;
    recommendation: string;
}

type WebsiteAnalysisOutput = {
    overallScore: number;
    overallSummary: string;
    metrics: Metric[];
}

const initialMetrics: Metric[] = [
    { name: 'Largest Contentful Paint', value: null, rating: null, explanation: 'Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds.', recommendation: 'Optimize your server, route users to a nearby CDN, cache assets, and optimize your images and critical rendering path.' },
    { name: 'Interaction to Next Paint', value: null, rating: null, explanation: 'Measures interactivity. An INP of 200 milliseconds or less is considered good.', recommendation: 'Break up long tasks, use `isInputPending`, yield to the main thread often, and minimize DOM size.' },
    { name: 'Cumulative Layout Shift', value: null, rating: null, explanation: 'Measures visual stability. To provide a good user experience, CLS should be maintained at 0.1 or less.', recommendation: 'Include size attributes on your images and video elements, and never insert content above existing content.' },
];

const metricIcons: { [key: string]: React.ReactNode } = {
  'Largest Contentful Paint': <Timer className="h-5 w-5" />,
  'Interaction to Next Paint': <Pointer className="h-5 w-5" />,
  'Cumulative Layout Shift': <ChevronsDownUp className="h-5 w-5" />,
};

const ratingConfig = {
    'Good': { icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
    'Needs Improvement': { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" /> },
    'Poor': { icon: <XCircle className="h-5 w-5 text-red-500" /> },
}

export function WebsiteAnalyzer() {
  const [analysis, setAnalysis] = useState<WebsiteAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      deviceType: 'desktop',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    // Reset metrics
    let currentMetrics: Metric[] = JSON.parse(JSON.stringify(initialMetrics));

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    // A timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError("Analysis timed out. The site may be blocking analysis or is too slow to load.");
        document.body.removeChild(iframe);
    }, 30000); // 30 second timeout

    iframe.onload = () => {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        const lcpValue = entry.startTime / 1000;
                        currentMetrics[0].value = lcpValue;
                        if (lcpValue <= 2.5) currentMetrics[0].rating = 'Good';
                        else if (lcpValue <= 4) currentMetrics[0].rating = 'Needs Improvement';
                        else currentMetrics[0].rating = 'Poor';
                    }
                     if (entry.entryType === 'first-input') {
                        const inpValue = entry.duration;
                        currentMetrics[1].value = inpValue;
                        if (inpValue <= 200) currentMetrics[1].rating = 'Good';
                        else if (inpValue <= 500) currentMetrics[1].rating = 'Needs Improvement';
                        else currentMetrics[1].rating = 'Poor';
                    }
                    if (entry.entryType === 'layout-shift') {
                        // CLS is cumulative
                        currentMetrics[2].value = (currentMetrics[2].value || 0) + (entry as any).value;
                        if (currentMetrics[2].value !== null) {
                          if (currentMetrics[2].value <= 0.1) currentMetrics[2].rating = 'Good';
                          else if (currentMetrics[2].value <= 0.25) currentMetrics[2].rating = 'Needs Improvement';
                          else currentMetrics[2].rating = 'Poor';
                        }
                    }
                }
            });

            observer.observe({ type: ['largest-contentful-paint', 'first-input', 'layout-shift'], buffered: true });

            // After a delay to allow metrics to be gathered
            setTimeout(() => {
                observer.disconnect();
                clearTimeout(timeoutId);
                
                const scoreMap = { 'Good': 10, 'Needs Improvement': 5, 'Poor': 1 };
                let totalScore = 0;
                let ratedMetrics = 0;

                currentMetrics.forEach(m => {
                    if(m.rating) {
                        totalScore += scoreMap[m.rating];
                        ratedMetrics++;
                    }
                });

                const finalScore = ratedMetrics > 0 ? totalScore / ratedMetrics : 0;

                setAnalysis({
                    metrics: currentMetrics,
                    overallScore: finalScore,
                    overallSummary: `Based on the collected Core Web Vitals, the site's performance is analyzed. Your score reflects the real user experience for a ${data.deviceType} device.`
                });
                setIsLoading(false);
                document.body.removeChild(iframe);
            }, 5000); // Wait 5 seconds for metrics

        } catch (e) {
            clearTimeout(timeoutId);
            setIsLoading(false);
            setError("Could not analyze this page. It may have security policies (CORS) that prevent analysis.");
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }
    };
    
    iframe.onerror = () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setError("Failed to load the URL. The site might be down or blocking requests.");
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
    };

    document.body.appendChild(iframe);
    iframe.src = data.url;
  };

  const scoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Website Performance Analyzer</CardTitle>
        <CardDescription>Enter a URL to get a live performance analysis based on Core Web Vitals.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
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
                        <Input placeholder="https://example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Analyze
                </Button>
            </div>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">Loading page and observing performance...</p>
            </div>
        )}

        {error && (
            <div className="mt-8 text-center text-destructive p-4 bg-destructive/10 rounded-md">
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
            </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            <Card className="bg-background/50">
                <CardHeader className="text-center">
                    <CardDescription>Overall Performance Score</CardDescription>
                    <CardTitle className={cn("text-7xl font-bold", scoreColor(analysis.overallScore))}>
                        {analysis.overallScore.toFixed(1)}<span className="text-4xl text-muted-foreground">/10</span>
                    </CardTitle>
                    <Progress value={analysis.overallScore * 10} className="w-full mt-2" />
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">{analysis.overallSummary}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis.metrics.map((metric) => (
                <Card key={metric.name} className="bg-background/30 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <span className="text-primary">{metricIcons[metric.name]}</span>
                      <span>{metric.name}</span>
                    </CardTitle>
                    <div className="flex items-baseline justify-between pt-2">
                        <CardDescription className="text-3xl font-bold">
                            {metric.value !== null ? `${(metric.value * 1000).toFixed(0)} ms` : 'N/A'}
                        </CardDescription>
                         {metric.rating ? <div className="flex items-center gap-2">
                            {ratingConfig[metric.rating].icon}
                            <span className="text-sm font-medium">{metric.rating}</span>
                        </div> : <span className="text-sm text-muted-foreground">Not observed</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">View Details</AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-2">
                           <p className="text-sm"><span className="font-semibold text-muted-foreground">What it is:</span> {metric.explanation}</p>
                           <p className="text-sm"><span className="font-semibold text-muted-foreground">Recommendation:</span> {metric.recommendation}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
