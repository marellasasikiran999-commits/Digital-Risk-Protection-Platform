import React from 'react';
import { motion } from 'framer-motion';
import { FadingVideo } from './FadingVideo';
import { BlurText } from './BlurText';
import { ArrowUpRight, Play, ClockIcon, GlobeIcon } from './Icons';

export const HeroSection: React.FC = () => {
  const sharedMotionProps = (delay: number) => ({
    initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
    animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: 'easeOut' as const },
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 pointer-events-none"
        style={{ width: '120%', height: '120%' }}
      />

      {/* Fixed Navbar */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 pointer-events-none">
        {/* Left: Liquid Glass Circle */}
        <div className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors">
          <span className="font-heading italic text-2xl text-white select-none">a</span>
        </div>

        {/* Center: Navigation Pill (Hidden on Mobile) */}
        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1 pointer-events-auto">
          {['Work', 'Studio', 'Services', 'Journal', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-white/90 transition-colors ml-1 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 text-black" />
          </a>
        </div>

        {/* Right: Spacer */}
        <div className="h-12 w-12" aria-hidden="true" />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            {...sharedMotionProps(0.4)}
            className="liquid-glass rounded-full px-3.5 py-1.5 inline-flex items-center gap-2.5 text-xs md:text-sm font-body text-white/90"
          >
            <span className="bg-white text-black font-semibold text-[11px] px-2 py-0.5 rounded-full font-body">
              New
            </span>
            <span>Booking Q3 2026 engagements -- limited capacity</span>
          </motion.div>

          {/* Headline */}
          <div className="mt-6 max-w-3xl">
            <BlurText
              text="Crafted Digital Experiences Built to Outlast Trends"
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
            />
          </div>

          {/* Subtext */}
          <motion.p
            {...sharedMotionProps(0.8)}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight"
          >
            We are a small studio of designers and engineers shaping brand-defining websites for
            ambitious companies. Precise typography, cinematic motion, and code you can be proud of.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div {...sharedMotionProps(1.1)} className="mt-6 flex items-center gap-6">
            <a
              href="#contact"
              className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-body text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>
            <button
              type="button"
              className="text-sm font-body text-white/90 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-white" />
              <span>Watch Showreel</span>
            </button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div {...sharedMotionProps(1.3)} className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
              <ClockIcon className="w-5 h-5 text-white/80" />
              <div>
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
                  6 Weeks
                </div>
                <p className="text-xs text-white/70 font-body font-light mt-1.5 leading-snug">
                  Average End-to-End Launch Time
                </p>
              </div>
            </div>

            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
              <GlobeIcon className="w-5 h-5 text-white/80" />
              <div>
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4 text-white">
                  140+
                </div>
                <p className="text-xs text-white/70 font-body font-light mt-1.5 leading-snug">
                  Brands Shipped Across Four Continents
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Bar */}
        <motion.div {...sharedMotionProps(1.4)} className="flex flex-col items-center gap-4 pb-8">
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80 font-body">
            Trusted by founders, operators, and creative directors worldwide
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map((logo) => (
              <span
                key={logo}
                className="font-heading italic text-2xl md:text-3xl tracking-tight text-white/80 hover:text-white transition-colors cursor-default select-none"
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
