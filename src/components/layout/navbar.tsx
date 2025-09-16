"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Studioo
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center">
               <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed top-0 left-0 w-full h-full bg-background/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out md:hidden',
          isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
        )}
        style={{paddingTop: '5rem'}}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    'text-2xl font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-foreground'
                )}
                onClick={closeMenu}
                >
                {link.label}
                </Link>
            ))}
            <Button asChild size="lg" className="mt-8" onClick={closeMenu}>
                <Link href="/contact">Contact Us</Link>
            </Button>
            </nav>
        </div>
      </div>
       <div className={cn("h-20", !isScrolled && pathname === '/' ? 'bg-transparent' : 'bg-transparent')}></div>

    </>
  );
}
