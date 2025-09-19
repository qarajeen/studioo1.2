
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { brandColorChecker, BrandColorCheckerOutput } from '@/ai/flows/brand-color-checker-flow';
import { Loader2, Search, Palette, PlusCircle, XCircle, Check, BadgePercent, MessageSquareQuote } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  brandColors: z.array(z.object({
    value: z.string().regex(hexColorRegex, "Invalid hex code"),
  })).min(1, "Please add at least one brand color."),
});

type FormValues = z.infer<typeof formSchema>;

export function BrandColorChecker() {
  const [analysis, setAnalysis] = useState<BrandColorCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      brandColors: [{ value: '#303F9F' }, { value: '#1A237E' }, {value: '#CE93D8'}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "brandColors",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await brandColorChecker({ 
        url: data.url, 
        brandColors: data.brandColors.map(c => c.value)
      });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getTextColor(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'text-black' : 'text-white';
  }

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Brand Color Consistency Checker</CardTitle>
        <CardDescription>Analyze your website's visual content against your brand's color palette.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
                <FormLabel>Your Brand Colors (Hex Codes)</FormLabel>
                 {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`brandColors.${index}.value`}
                      render={({ field }) => (
                         <FormItem>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-grow">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border" style={{ backgroundColor: form.watch(`brandColors.${index}.value`) }} />
                                    <FormControl>
                                        <Input {...field} placeholder="#FFFFFF" className="pl-10" disabled={isLoading} />
                                    </FormControl>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={isLoading || fields.length <= 1}>
                                    <XCircle className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                            <FormMessage />
                         </FormItem>
                      )}
                    />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  disabled={isLoading}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Color
                </Button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
              Check Consistency
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
            <p className="mt-4 text-muted-foreground">Analyzing colors... this may take a moment.</p>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center text-destructive">
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            <Card className="bg-background/50 text-center">
              <CardHeader>
                <CardDescription>Brand Color Consistency</CardDescription>
                <CardTitle className={cn("text-7xl font-bold", scoreColor(analysis.consistencyScore))}>
                  {analysis.consistencyScore.toFixed(0)}%
                </CardTitle>
                <Progress value={analysis.consistencyScore} className="w-full mt-2" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{analysis.summary}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-background/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <Palette className="h-5 w-5 text-primary" />
                            Detected Color Palette
                        </CardTitle>
                        <CardDescription>
                            The most prominent colors found in your visual content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                             {analysis.detectedPalette.map((color) => (
                                <div
                                    key={color.hex}
                                    className={cn(
                                        "relative rounded-lg p-2 flex items-center justify-center font-mono text-sm shadow-inner overflow-hidden",
                                        getTextColor(color.hex)
                                    )}
                                    style={{ backgroundColor: color.hex, width: `${color.prominence}%`, minWidth: '60px', height: '60px' }}
                                >
                                    <span>{color.hex}</span>
                                    {color.isBrandColor && (
                                        <div className="absolute top-1 right-1 bg-white/70 text-black rounded-full p-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                           <MessageSquareQuote className="h-5 w-5 text-primary" />
                           AI Recommendation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{analysis.recommendation}</p>
                         <Button asChild className="mt-4">
                            <Link href="/contact">Book a Free Consultation</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
