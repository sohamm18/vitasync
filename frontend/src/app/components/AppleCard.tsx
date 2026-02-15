import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/app/components/ui/card';

export default function AppleCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className={`overflow-hidden border-none shadow-xl shadow-black/5 bg-white/80 backdrop-blur-sm rounded-3xl ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
}