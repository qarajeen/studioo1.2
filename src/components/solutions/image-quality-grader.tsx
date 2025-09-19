
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { analyzeImageQuality, ImageQualityOutput } from '@/ai/flows/analyze-image-quality-flow';
import { Loader2, Search, ArrowRight, Image as ImageIcon, FileWarning, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

export function ImageQualityGrader() {
  const [analysis, setAnalysis] = useState<ImageQualityOutput | null>(null);
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
  };
  
  const issueIcon = (issue: string) => {
    const lowercasedIssue = issue.toLowerCase();
    if (lowercasedIssue.includes('size') || lowercasedIssue.includes('large')) {
        return <FileWarning className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
    }
    if (lowercasedIssue.includes('format')) {
        return <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />;
    }
    if (lowercasedIssue.includes('resolution')) {
        return <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    }
    return <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  }

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Website Image Grader</CardTitle>
        <CardDescription>Analyze your webpage's images for performance and quality issues.</CardDescription>
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
                        <Input placeholder="https://example.com" {...field} disabled={isLoading} />
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
                <p className="mt-4 text-muted-foreground">Scanning for images... this may take a moment.</p>
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
                    <CardDescription>Overall Image Score</CardDescription>
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
                <h3 className="text-xl font-semibold mb-4">Image Breakdown</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[150px] sm:w-[200px]">Image</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Issue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysis.imageBreakdown.map((image, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium truncate">{image.imageName}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-xs">
                                        <span><span className="font-semibold">Size:</span> {image.size}</span>
                                        <span><span className="font-semibold">Format:</span> {image.format}</span>
                                        <span><span className="font-semibold">Res:</span> {image.resolution}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {issueIcon(image.issue)}
                                        <span className="hidden sm:inline">{image.issue}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle>Ready to Improve Your Score?</CardTitle>
                    <CardDescription>
                        Slow, heavy images don't just hurt your performance score—they hurt your business. We provide professional photography and optimization services to ensure your website is fast, beautiful, and ready to convert.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/services">
                            Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    