
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, DollarSign, Mail, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navLinks = [
  { href: '/', label: 'Home', icon: <Home className="h-5 w-5 sm:h-6 sm:w-6" /> },
  { href: '/services', label: 'Services', icon: <Image className="h-5 w-5 sm:h-6 sm:w-6" /> },
  { href: '/tools', label: 'Tools', icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" /> },
  { href: '/contact', label: 'Contact', icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6" /> },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#4f4f4f]/80 backdrop-blur-sm border border-border rounded-full shadow-lg">
        <ul className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors duration-300',
                      pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-transparent text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
                    )}
                  >
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover text-popover-foreground">
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
    </TooltipProvider>
  );
}
