// app/components/ui/dynamic-island.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '#app/utils/misc';

interface DynamicIslandProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DynamicIsland({ trigger, children, className }: DynamicIslandProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsland = () => setIsOpen(!isOpen);

  const variants = {
    closed: {
      height: 'auto',
      width: '350px',
      scale: 1,
      boxShadow: '0',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }
    },
    open: {
      height: 'auto',
      width: '450px',
      scale: 1.01,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm",
        className
      )}
      variants={variants}
      animate={isOpen ? 'open' : 'closed'}
      onClick={toggleIsland}
    >
      <motion.div 
        className="p-4"
        animate={{ scale: isOpen ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {trigger}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}