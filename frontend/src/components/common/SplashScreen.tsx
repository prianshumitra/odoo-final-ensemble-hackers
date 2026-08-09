import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Increment progress bar smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, duration / 20);

    // Trigger fade-out animation right before finish
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 500);

    // Complete splash screen
    const finishTimer = setTimeout(() => {
      setIsHidden(true);
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F4EF] text-[#1C1C1C] transition-all duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-110 blur-sm pointer-events-none' : 'opacity-100 scale-100 blur-none'
      }`}
    >
      {/* Background Subtle Radial Dot Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(28, 28, 28, 0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Rotating Background Glow Orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-[#E8B923]/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-[#0A0A0A]/5 blur-2xl pointer-events-none animate-spin" style={{ animationDuration: '12s' }} />

      {/* Central Glass Card */}
      <div className="relative bg-[#FAF8F5]/95 p-8 sm:p-12 rounded-3xl border border-[#E8E4DE] shadow-warm-lg max-w-sm w-full text-center space-y-6 z-10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Favicon Icon Wrapper with Aura & Float */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Expanding Pulsing Aura Rings */}
          <div className="absolute inset-0 rounded-3xl bg-[#E8B923]/20 animate-pulse-aura pointer-events-none" />
          <div className="absolute -inset-2 rounded-3xl border border-[#E8B923]/40 animate-ping pointer-events-none" />

          {/* Favicon White Card Container with Floating Animation */}
          <div className="relative w-full h-full bg-white rounded-3xl border border-[#E8E4DE] shadow-[0_10px_30px_-5px_rgba(232,185,35,0.3)] p-4 flex items-center justify-center animate-float-slow">
            <img
              src="/favicon.png"
              alt="EZRent Favicon Splash"
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E8E4DE] shadow-warm-xs text-[11px] font-black text-[#1C1C1C]">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B923] animate-spin" style={{ animationDuration: '6s' }} />
            <span>EZRent Equipment Platform</span>
          </div>

          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight font-serif pt-1">
            EZRent
          </h1>
          <p className="text-xs font-bold text-[#8A857F]">
            Premium Rentals • Escrow Secured Deposits
          </p>
        </div>

        {/* Progress Bar Container with Shimmer Effect */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-2.5 bg-[#E8E4DE] rounded-full overflow-hidden p-0.5 border border-black/5 shadow-inner relative">
            <div
              className="h-full bg-gradient-to-r from-[#0A0A0A] via-[#E8B923] to-[#0A0A0A] rounded-full transition-all duration-200 ease-out shadow-warm-xs relative"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight Streak Shimmer */}
              <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-black text-[#8A857F] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8B923]" />
              Verifying System
            </span>
            <span className="text-[#1C1C1C] font-mono">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
