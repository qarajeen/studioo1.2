
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeWebsite, WebsiteAnalysisOutput } from '@/ai/flows/analyze-website-flow';
import { Loader2, Search, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

const metricIcons: { [key: string]: React.ReactNode } = {
  'Largest Contentful Paint': <TrendingDown className="h-5 w-5 text-red-400" />,
  'Interaction to Next Paint': <TrendingDown className="h-5 w-5 text-red-400" />,
  'Cumulative Layout Shift': <TrendingDown className="h-5 w-5 text-red-400" />,
  'First Contentful Paint': <TrendingUp className="h-5 w-5 text-green-400" />,
  'Time to First Byte': <TrendingUp className="h-5 w-5 text-green-400" />,
  'Speed Index': <TrendingUp className="h-5 w-5 text-green-400" />,
};

const ratingIcons: { [key: string]: React.ReactNode } = {
    'Good': <CheckCircle className="h-5 w-5 text-green-500" />,
    'Needs Improvement': <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    'Poor': <XCircle className="h-5 w-5 text-red-500" />,
}

export function WebsiteAnalyzer() {
  const [analysis, setAnalysis] = useState<WebsiteAnalysisOutput | null>(null);
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
      const result = await analyzeWebsite({ url: data.url });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Website Performance Analyzer</CardTitle>
        <CardDescription>Enter a URL to get an AI-powered performance analysis and actionable recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Analyze
            </Button>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">Analyzing page... this may take a moment.</p>
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
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>{metric.name}</span>
                      {ratingIcons[metric.rating]}
                    </CardTitle>
                    <CardDescription className="text-3xl font-bold pt-2">
                        {metric.value}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                        <p className="text-sm"><span className="font-semibold">What it is:</span> {metric.explanation}</p>
                        <p className="text-sm mt-2"><span className="font-semibold">Recommendation:</span> {metric.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
