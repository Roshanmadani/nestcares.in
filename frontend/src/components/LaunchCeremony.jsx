import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';

// Full-screen launch ceremony: tap "Launch" → 3-2-1 → light burst + confetti → website.
const CONFETTI_COLORS = ['#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#ffffff', '#f97316'];

const LaunchCeremony = ({ onDone }) => {
  const [stage, setStage] = useState('ready'); // ready | countdown | burst
  const [count, setCount] = useState(3);

  const confetti = useMemo(() => Array.from({ length: 90 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 160 + Math.random() * 520;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 120,
      rotate: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.5,
      delay: Math.random() * 0.25,
    };
  }), []);

  useEffect(() => {
    if (stage !== 'countdown') return;
    if (count === 0) {
      setStage('burst');
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 900);
    return () => clearTimeout(t);
  }, [stage, count]);

  useEffect(() => {
    if (stage !== 'burst') return;
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [stage, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-[#06070a] text-white flex items-center justify-center overflow-hidden select-none"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Horizon glow */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 bottom-0 w-[180vmax] h-[60vmax] rounded-[50%] -translate-x-1/2 translate-y-[78%]"
        style={{ background: '#06070a', boxShadow: '0 -2px 0 rgba(52,211,153,0.8), 0 -40px 120px -20px rgba(52,211,153,0.55), 0 -120px 240px -60px rgba(56,189,248,0.4)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blessing, shown throughout */}
      <motion.div
        className="absolute top-6 sm:top-10 left-0 right-0 text-center text-[13px] sm:text-base font-bold tracking-[0.3em] uppercase text-amber-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textShadow: '0 0 18px rgba(251,191,36,0.45)' }}
      >
        🙏 Jai Bhavani 🙏
      </motion.div>

      <AnimatePresence mode="wait">
        {stage === 'ready' && (
          <motion.div
            key="ready"
            className="relative flex flex-col items-center text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-white p-3 shadow-[0_0_60px_rgba(52,211,153,0.35)]">
              <img src="/logo.png" alt="Nest Cares" className="h-full w-full object-contain" />
            </div>
            <div className="mt-6 text-[12px] sm:text-sm font-bold uppercase tracking-[0.35em] text-emerald-300">Grand Launch</div>
            <h1 className="mt-3 text-5xl sm:text-7xl font-black tracking-tight !text-white">Nest Cares</h1>
            <p className="mt-3 text-base sm:text-xl text-white/70">Hospital-grade care, right at home · Nizamabad</p>

            <motion.button
              type="button"
              onClick={() => setStage('countdown')}
              whileTap={{ scale: 0.94 }}
              className="relative mt-12 h-36 w-36 sm:h-44 sm:w-44 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-black text-xl sm:text-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_0_10px_rgba(52,211,153,0.15),0_20px_60px_rgba(16,185,129,0.6)] cursor-pointer"
            >
              <span className="absolute inset-0 rounded-full border-2 border-emerald-300 anim-live-pulse" />
              <Rocket className="w-8 h-8 sm:w-10 sm:h-10" />
              LAUNCH
            </motion.button>
            <p className="mt-6 text-sm text-white/50">Tap to launch www.nestcares.in</p>
          </motion.div>
        )}

        {stage === 'countdown' && count > 0 && (
          <motion.div
            key={`c${count}`}
            className="relative text-[11rem] sm:text-[16rem] font-black leading-none text-emerald-300"
            initial={{ opacity: 0, scale: 2.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ textShadow: '0 0 60px rgba(52,211,153,0.6)' }}
          >
            {count}
          </motion.div>
        )}

        {stage === 'burst' && (
          <motion.div key="burst" className="relative flex flex-col items-center text-center px-6">
            {/* Flash */}
            <motion.div
              className="fixed inset-0 bg-white pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
            {/* Expanding light ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-40 w-40 -ml-20 -mt-20 rounded-full border-4 border-emerald-300"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 14, opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
            {/* Confetti */}
            {confetti.map(p => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2"
                style={{ width: p.size, height: p.size * (p.round ? 1 : 0.5), background: p.color, borderRadius: p.round ? '999px' : '2px' }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: p.x, y: [p.y, p.y + 500], opacity: [1, 1, 0], rotate: p.rotate }}
                transition={{ duration: 3.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[12px] sm:text-sm font-bold uppercase tracking-[0.35em] text-emerald-300">We are live</div>
              <h2 className="mt-3 text-5xl sm:text-7xl font-black tracking-tight !text-white">Welcome to<br />Nest Cares</h2>
              <p className="mt-4 text-base sm:text-xl text-white/70">www.nestcares.in</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LaunchCeremony;
