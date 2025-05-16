'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const pathname = usePathname();
  
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <Link href="/" className="text-lg font-semibold">BitByBit</Link>
        </div>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/transactions' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Transactions
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            Connect Bank
          </Button>
          <Button size="sm" id="manage-roundups-button">
            Manage Roundups
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 