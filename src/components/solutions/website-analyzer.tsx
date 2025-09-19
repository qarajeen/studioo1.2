
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from "jspdf";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeWebsite, WebsiteAnalysisOutput } from '@/ai/flows/analyze-website-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, Timer, Pointer, ChevronsDownUp, PictureInPicture2, Hourglass, ShieldCheck, Download, Smartphone, Monitor } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  deviceType: z.enum(['desktop', 'mobile']),
});

type FormValues = z.infer<typeof formSchema>;

const metricIcons: { [key: string]: React.ReactNode } = {
  'Largest Contentful Paint': <PictureInPicture2 className="h-5 w-5" />,
  'Interaction to Next Paint': <Pointer className="h-5 w-5" />,
  'Cumulative Layout Shift': <ChevronsDownUp className="h-5 w-5" />,
  'First Contentful Paint': <Timer className="h-5 w-5" />,
  'Time to First Byte': <ShieldCheck className="h-5 w-5" />,
  'Speed Index': <Hourglass className="h-5 w-5" />,
};

const ratingConfig = {
    'Good': { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: [74, 168, 74] },
    'Needs Improvement': { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: [224, 168, 0] },
    'Poor': { icon: <XCircle className="h-5 w-5 text-red-500" />, color: [220, 53, 69] },
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

    try {
      const result = await analyzeWebsite({ url: data.url, deviceType: data.deviceType });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 0;

    const primaryColor = [99, 88, 140];
    const textColor = [51, 51, 51];
    const lightTextColor = [100, 100, 100];
    const white = [255, 255, 255];
    const backgroundColor = [248, 249, 250];

    doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text("Studioo", margin, 17);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Website Performance Report", pageWidth - margin, 17, { align: 'right' });
    
    currentY = 40;

    doc.setFontSize(10);
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text("Analyzed URL:", margin, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(form.getValues('url'), margin + 28, currentY);

    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    const deviceText = `Device: ${form.getValues('deviceType').charAt(0).toUpperCase() + form.getValues('deviceType').slice(1)}`;
    doc.text(deviceText, pageWidth - margin, currentY, { align: 'right' });

    currentY += 15;

    // --- Overall Score ---
    const scoreColor = (score: number) => {
        if (score >= 9) return [74, 168, 74]; // Good
        if (score >= 5) return [224, 168, 0]; // Needs Improvement
        return [220, 53, 69]; // Poor
    };
    const finalScoreColor = scoreColor(analysis.overallScore);
    doc.setDrawColor(finalScoreColor[0], finalScoreColor[1], finalScoreColor[2]);
    doc.setLineWidth(1.5);
    doc.circle(pageWidth / 2, currentY + 15, 20);

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(finalScoreColor[0], finalScoreColor[1], finalScoreColor[2]);
    doc.text(analysis.overallScore.toFixed(1), pageWidth / 2, currentY + 18, { align: 'center' });

    currentY += 45;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const summaryLines = doc.splitTextToSize(analysis.overallSummary, pageWidth - margin * 2);
    doc.text(summaryLines, pageWidth / 2, currentY, { align: 'center' });
    
    currentY += (summaryLines.length * 5) + 15;

    // --- Metrics Details ---
    analysis.metrics.forEach((metric, index) => {
        if (currentY > pageHeight - 50) {
            doc.addPage();
            doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            currentY = margin;
        }

        const ratingInfo = ratingConfig[metric.rating as keyof typeof ratingConfig];

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(metric.name, margin, currentY);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(ratingInfo.color[0], ratingInfo.color[1], ratingInfo.color[2]);
        doc.text(metric.value, pageWidth - margin, currentY, { align: 'right' });

        currentY += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.text(`"${metric.explanation}"`, margin, currentY);

        currentY += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const recLines = doc.splitTextToSize(`Recommendation: ${metric.recommendation}`, pageWidth - margin * 2 - 5);
        doc.text("•", margin, currentY);
        doc.text(recLines, margin + 5, currentY);
        
        currentY += (recLines.length * 4) + 10;
        
        if (index < analysis.metrics.length - 1) {
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.2);
            doc.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 8;
        }
    });

    // --- Footer ---
    const footerY = pageHeight - 15;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text('Powered by Studioo AI', margin, footerY + 8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin, footerY + 8, { align: 'right' });

    doc.save("website-performance-report.pdf");
  }

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
            <FormField
              control={form.control}
              name="deviceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Device</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                      disabled={isLoading}
                    >
                      <FormItem>
                        <FormControl>
                           <RadioGroupItem value="desktop" id="desktop" className="sr-only" />
                        </FormControl>
                        <Label htmlFor="desktop" className={cn("flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", field.value === 'desktop' ? 'border-primary bg-accent' : 'border-border')}>
                            <Monitor className="h-6 w-6 mb-2"/>
                            Desktop
                        </Label>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="mobile" id="mobile" className="sr-only" />
                        </FormControl>
                         <Label htmlFor="mobile" className={cn("flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", field.value === 'mobile' ? 'border-primary bg-accent' : 'border-border')}>
                            <Smartphone className="h-6 w-6 mb-2"/>
                            Mobile
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <span className="text-primary">{metricIcons[metric.name]}</span>
                      <span>{metric.name}</span>
                    </CardTitle>
                    <div className="flex items-baseline justify-between pt-2">
                        <CardDescription className="text-3xl font-bold">
                            {metric.value}
                        </CardDescription>
                         <div className="flex items-center gap-2">
                            {ratingConfig[metric.rating as keyof typeof ratingConfig].icon}
                            <span className="text-sm font-medium">{metric.rating}</span>
                        </div>
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
             <div className="flex justify-end mt-6">
                <Button onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
