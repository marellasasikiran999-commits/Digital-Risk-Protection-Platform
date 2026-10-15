import React from 'react';
import { motion } from 'framer-motion';
import { FadingVideo } from './FadingVideo';
import { ImageIcon, MovieIcon, LightbulbIcon } from './Icons';

interface CapabilityCardProps {
  icon: React.ReactNode;
  tags: string[];
  title: string;
  body: string;
  delay?: number;
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({ icon, tags, title, body, delay = 0 }) => {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' as const }}
      className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between group hover:bg-white/[0.03] transition-colors"
    >
      {/* Top Row: Icon and Tags */}
      <div className="flex items-start justify-between gap-3">
        <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center shrink-0 text-white">
          {icon}
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {tags.map((tag) => (
            <span
              key={tag}
              className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 my-6" />

      {/* Bottom: Title & Body */}
      <div>
        <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
          {body}
        </p>
      </div>
    </motion.div>
  );
};

export const CapabilitiesSection: React.FC = () => {
  return (
    <section id="services" className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-auto">
          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
            className="text-sm font-body text-white/80 mb-6"
          >
            // Capabilities
          </motion.p>
          <motion.h2
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' as const }}
            className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] text-white whitespace-pre-line"
          >
            {"Studio craft,\nend to end"}
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CapabilityCard
            icon={<ImageIcon className="w-5 h-5" />}
            tags={['Brand Systems', 'Art Direction', 'Visual Identity', 'Motion']}
            title="Design"
            body="We shape identities and interfaces that feel unmistakably yours -- typographic systems, component libraries, and art-directed pages that scale without losing soul."
            delay={0.2}
          />

          <CapabilityCard
            icon={<MovieIcon className="w-5 h-5" />}
            tags={['React', 'Next.js', 'Headless CMS', 'Edge-Ready']}
            title="Engineering"
            body="Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented -- with code your team will enjoy extending long after launch."
            delay={0.35}
          />

          <CapabilityCard
            icon={<LightbulbIcon className="w-5 h-5" />}
            tags={['SEO', 'Analytics', 'A/B Testing', 'Retention']}
            title="Growth"
            body="Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};
