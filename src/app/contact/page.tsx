import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Get In Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input id="phone" type="tel" placeholder="Your Phone Number" />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us about your project..." rows={6} />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto btn-glow-primary">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Details & ADHD Connect */}
          <div className="space-y-8">
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
                  <Phone className="h-6 w-6 text-primary" />
                  <a href="tel:+971586583939" className="text-muted-foreground hover:text-foreground">+971 58 658 3939</a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20 card-glowing">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Pencil className="h-6 w-6 text-accent" />
                  ADHD Creatives Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our community is the heart of our superpower. If you're an ADHD creative, we invite you to connect, share your story, and explore collaborations.
                </p>
                <Button asChild variant="secondary">
                  <Link href="mailto:connect@studioo.ae">Share Your Story</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
