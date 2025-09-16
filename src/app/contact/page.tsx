
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Pencil } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


export default function ContactPage() {
  return (
    <div className="min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Get In Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <a href="mailto:hi@studioo.ae" className="text-muted-foreground hover:text-foreground">hi@studioo.ae</a>
              </div>
              <div className="flex items-center gap-4">
                <WhatsAppIcon className="h-6 w-6 text-primary" />
                <a href="https://wa.me/971586583939" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">+971 58 658 3939</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Pencil className="h-6 w-6 text-primary" />
                ADHD Creatives Connect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our community is the heart of our superpower. If you're an ADHD creative, we invite you to connect, share your story, and explore collaborations.
              </p>
              <Button asChild>
                <Link href="https://wa.me/971586583939" target="_blank" rel="noopener noreferrer">Share Your Story</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
