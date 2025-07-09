
import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onDashboard: () => void;
  onCustomers: () => void;
  onPackages: () => void;
  onPayments: () => void;
  onSupport: () => void;
  onNetwork: () => void;
  onReports: () => void;
}

export const useKeyboardShortcuts = ({
  onDashboard,
  onCustomers,
  onPackages,
  onPayments,
  onSupport,
  onNetwork,
  onReports
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when Ctrl/Cmd + Alt are pressed
      if (!(event.ctrlKey || event.metaKey) || !event.altKey) return;

      switch (event.key.toLowerCase()) {
        case 'd':
          event.preventDefault();
          onDashboard();
          break;
        case 'c':
          event.preventDefault();
          onCustomers();
          break;
        case 'p':
          event.preventDefault();
          onPackages();
          break;
        case 'm':
          event.preventDefault();
          onPayments();
          break;
        case 's':
          event.preventDefault();
          onSupport();
          break;
        case 'n':
          event.preventDefault();
          onNetwork();
          break;
        case 'r':
          event.preventDefault();
          onReports();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDashboard, onCustomers, onPackages, onPayments, onSupport, onNetwork, onReports]);
};
