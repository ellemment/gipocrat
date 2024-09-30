// app/ellemment-ui/components/navigation/header-global.tsx

import { Link, useLocation } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Logo from '#app/components/logo';
import { NavLinks } from '#app/ellemment-ui/components/navigation/navlinks';
import { ThemeSwitch } from '#app/routes/resources+/theme-switch';
import { type Theme } from '#app/utils/theme.server';

interface GlobalHeaderProps {
  userPreference: Theme | null;
  className?: string;
}

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 6h14M5 18h14M5 12h14" />
    </svg>
  );
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function GlobalHeader({ userPreference, className = '' }: GlobalHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <header className={`relative z-50 ${className}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to='/' className="text-inherit hover:opacity-75 transition-opacity">
              <span className="text-sm font-medium">Gipocrat</span>
            </Link>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-10">
            <NavLinks />
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch userPreference={userPreference ?? 'dark'} />
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-current p-2 hover:bg-gray-200/50 hover:opacity-75 active:stroke-current"
                aria-label="Toggle site navigation"
              >
                {expanded ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-300/60 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -32,
                transition: { duration: 0.2 },
              }}
              className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-white px-6 pb-6 pt-24 shadow-2xl shadow-gray-900/20"
            >
              <div className="space-y-4">
                <NavLinks />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}