"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, DollarSign, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navLinks = [
  { href: '/', label: 'Home', icon: <Home className="h-6 w-6" /> },
  { href: '/services', label: 'Services', icon: <Image className="h-6 w-6" /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign className="h-6 w-6" /> },
  { href: '/contact', label: 'Contact', icon: <Mail className="h-6 w-6" /> },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-lg">
        <ul className="flex items-center gap-2 p-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300',
                      pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-transparent text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground'
                    )}
                  >
                    {link.icon}
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
