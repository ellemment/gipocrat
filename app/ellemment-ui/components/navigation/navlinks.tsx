// app/ellemment-ui/components/navigation/navlinks.tsx

import { NavLink } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';

const navItems = [
  { label: 'Keynote', href: '/#keynote' },
  { label: 'Documentation', href: '/#docs' },
  { label: 'Changelog', href: '/#logs' },
  { label: 'Application', href: '/#app' },
  { label: 'Account', href: '/account' },
] as const;

export function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  return navItems.map(({ label, href }, index) => (
    <NavLink
      key={label}
      to={href}
      className={({ isActive }) =>
        `relative -mx-3 -my-2 rounded-lg px-3 py-2 text-xs transition-colors delay-150 hover:delay-0 ${
          isActive 
            ? 'text-neutral-900 dark:text-neutral-100' 
            : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'
        }`
      }
      onMouseEnter={() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        setHoveredIndex(index);
      }}
      onMouseLeave={() => {
        timeoutRef.current = window.setTimeout(() => {
          setHoveredIndex(null);
        }, 200);
      }}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15 },
            }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </NavLink>
  ));
}