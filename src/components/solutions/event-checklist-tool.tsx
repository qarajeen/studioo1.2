
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure you have this import for table generation
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateEventChecklist, EventChecklistOutput } from '@/ai/flows/generate-event-checklist-flow';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend jsPDF with autoTable
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

export function EventChecklistTool() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleGeneratePdf = (checklistData: EventChecklistOutput) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 0;

    // --- PDF Styling ---
    const primaryColor = '#4A3AFF'; // approx from theme
    const textColor = '#333333';
    const lightTextColor = '#666666';

    // --- Header ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text("Studioo", margin, 17);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("The Ultimate Event Photography Checklist", pageWidth - margin, 17, { align: 'right' });
    currentY = 35;

    // --- Introduction ---
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    const introLines = doc.splitTextToSize(checklistData.introduction, pageWidth - margin * 2);
    doc.text(introLines, margin, currentY);
    currentY += introLines.length * 5 + 10;

    // --- Checklist Sections & Items ---
    checklistData.sections.forEach(section => {
        if (currentY > 250) { // Add new page if content overflows
            doc.addPage();
            currentY = margin;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor);
        doc.text(section.title, margin, currentY);
        currentY += 8;

        const tableBody = section.items.map(item => [
            `[  ] ${item.title}`, // Checkbox placeholder
            item.description
        ]);

        doc.autoTable({
            startY: currentY,
            head: [['Task', 'Details']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [74, 58, 255], textColor: 255 },
            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 2,
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 'auto' },
            },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 0) {
                     // We can't draw interactive checkboxes, so the text placeholder is the best we can do.
                }
            }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
    });

    // --- Conclusion ---
    if (currentY > 260) {
        doc.addPage();
        currentY = margin;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    const conclusionLines = doc.splitTextToSize(checklistData.conclusion, pageWidth - margin * 2);
    doc.text(conclusionLines, margin, currentY);
    currentY += conclusionLines.length * 5 + 10;
    
    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(lightTextColor);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 287, { align: 'center' });
        doc.text('© Studioo | hi@studioo.ae | studioo.ae', margin, 287);
    }

    // --- Save PDF ---
    doc.save('Studioo_Event_Photography_Checklist.pdf');
  };


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submitting email:", data.email);
      // Here you would typically send the email to your backend/service
      // For now, we just simulate success.
      
      const checklistData = await generateEventChecklist();
      handleGeneratePdf(checklistData);

      toast({
        title: "Success!",
        description: "Your checklist is downloading. Thank you!",
      });

    } catch (e) {
      console.error(e);
      toast({
        title: "An error occurred",
        description: "Could not generate the checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
            <Download className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">The Ultimate Event Photography Checklist</CardTitle>
        <CardDescription>Enter your email to download our free, comprehensive guide for marketing and event managers.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm mx-auto mt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@company.com" {...field} disabled={isLoading} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Download Now
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground text-center mt-4 max-w-sm mx-auto">
            By downloading, you agree to receive occasional marketing updates from Studioo. You can unsubscribe at any time.
        </p>
      </CardContent>
    </div>
  );
}
