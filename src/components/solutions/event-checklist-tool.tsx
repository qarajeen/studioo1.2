
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

const checklistData = {
  introduction: "A successful event is a story told through compelling visuals. This checklist, crafted by the experts at STUDIOO, is your guide to ensuring every critical moment is captured with intent and creativity. Use it to align with your photographer and guarantee a final gallery that exceeds expectations and extends the life of your event.",
  conclusion: "Your event is more than just a gathering; it's a strategic investment. Don't leave its visual legacy to chance. At STUDIOO, we combine technical expertise with creative storytelling to produce photography that drives engagement and amplifies your brand. Ready to create something unforgettable? Visit studioo.ae or book a free consultation with our production experts today.",
  sections: [
    {
      title: "Phase 1: Pre-Event Strategy & Briefing",
      items: [
        { title: "Define Core Objectives", description: "What is the primary goal of the photography? (e.g., social media content, press release, internal use).", category: "Planning" },
        { title: "Create a 'Must-Have' Shot List", description: "List all key speakers, VIPs, sponsors, and specific moments that must be captured.", category: "Planning" },
        { title: "Develop a Mood Board", description: "Share visual examples of the style, tone, and composition you're looking for.", category: "Creative" },
        { title: "Confirm Brand Guidelines", description: "Provide the photographer with logos, brand colors, and guidelines on how to represent the brand.", category: "Planning" },
        { title: "Share the Official Event Schedule", description: "Include timings for keynotes, panels, breaks, and any special announcements.", category: "Logistics" },
        { title: "Discuss Deliverables & Deadlines", description: "Agree on the number of photos, editing style, and delivery dates for previews and final gallery.", category: "Post-Event" }
      ]
    },
    {
      title: "Phase 2: On-Site Logistics & Technical Prep",
      items: [
        { title: "Conduct a Venue Walkthrough", description: "Scout the location with the photographer to identify key photo spots and lighting challenges.", category: "Logistics" },
        { title: "Secure Necessary Credentials", description: "Ensure the photographer has the required passes for all-access, including backstage and VIP areas.", category: "Logistics" },
        { title: "Establish a Communication Plan", description: "Designate a single point of contact on-site for the photographer for any urgent requests.", category: "Logistics" },
        { title: "Verify Internet Access for Live Uploads", description: "If immediate social media content is needed, confirm Wi-Fi details and reliability.", category: "Technical" },
        { title: "Review Power & Charging Stations", description: "Identify secure locations where the photographer can charge batteries and equipment.", category: "Technical" }
      ]
    },
    {
      title: "Phase 3: During The Event - Capturing The Story",
      items: [
        { title: "Capture the Venue & Ambiance", description: "Wide shots of the setup before guests arrive, including branding, decor, and staging.", category: "Creative" },
        { title: "Photograph Speakers & Panels", description: "Dynamic shots of presenters on stage, as well as audience engagement and reactions.", category: "Creative" },
        { title: "Focus on Attendee Interaction", description: "Candid moments of networking, collaboration, and guests enjoying the experience.", category: "Creative" },
        { title: "Showcase Sponsor & Exhibitor Presence", description: "Clear shots of sponsor logos, booths, and interactions at exhibitor stands.", category: "Planning" },
        { title: "Detail Shots of Food & Beverage", description: "Artistic shots of catering, coffee breaks, and dining experiences.", category: "Creative" },
        { title: "Behind-the-Scenes Moments", description: "Capture the event team, production crew, and candid moments that tell a larger story.", category: "Creative" }
      ]
    },
    {
      title: "Phase 4: Post-Event Workflow & Delivery",
      items: [
        { title: "Confirm Receipt of Preview Photos", description: "Ensure a small batch of highlight photos is delivered within 24 hours for immediate PR/social use.", category: "Post-Event" },
        { title: "Review the Full Edited Gallery", description: "Check the final selection for quality, consistency, and adherence to the brief.", category: "Post-Event" },
        { title: "Obtain All High-Resolution Files", description: "Secure the final, high-resolution images via the agreed-upon delivery method (e.g., online gallery, hard drive).", category: "Post-Event" },
        { title: "Clarify Image Usage Rights", description: "Re-confirm the usage rights for marketing, commercial, and promotional activities as per the contract.", category: "Planning" },
        { title: "Provide Feedback to the Photographer", description: "Share constructive feedback to build a strong relationship for future events.", category: "Post-Event" }
      ]
    }
  ]
};

export function EventChecklistTool() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleGeneratePdf = () => {
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
      // Simulate a small delay to feel like work is being done
      await new Promise(resolve => setTimeout(resolve, 500));
      
      handleGeneratePdf();

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
