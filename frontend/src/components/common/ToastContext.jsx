import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-100 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.06)]',
    error: 'border-rose-100 bg-white shadow-[0_10px_30px_rgba(244,63,94,0.06)]',
    info: 'border-blue-105 bg-white shadow-[0_10px_30px_rgba(59,130,246,0.06)]',
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed left-4 right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm z-[9999] flex flex-col gap-3 no-print pointer-events-none [&>*]:pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`
                flex items-center gap-3 p-4 border rounded-2xl w-full text-left
                ${borderStyles[toast.type]}
              `}
            >
              <div className="shrink-0">{icons[toast.type]}</div>
              <div className="flex-1 text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
