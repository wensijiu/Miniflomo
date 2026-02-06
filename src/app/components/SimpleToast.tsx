import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SimpleToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export function SimpleToast({ message, show, onClose }: SimpleToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="bg-[#323232] text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium"
          >
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
