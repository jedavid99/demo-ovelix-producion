import { motion, AnimatePresence } from 'framer-motion';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarOverlay = ({ isOpen, onClose }: SidebarOverlayProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
    )}
  </AnimatePresence>
);
