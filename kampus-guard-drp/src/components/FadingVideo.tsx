import React, { useRef, useState, useEffect, useCallback } from 'react';

interface FadingVideoProps {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
}

export const FadingVideo: React.FC<FadingVideoProps> = ({ src, className = '', style = {} }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFadingOutRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const currentSrc = Array.isArray(src) ? src[currentIndex] : src;

  const cancelAnimation = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const fadeIn = useCallback((duration = 500) => {
    cancelAnimation();
    isFadingOutRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    const start = performance.now();
    const initialOpacity = parseFloat(video.style.opacity || '0') || 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = initialOpacity + (1 - initialOpacity) * progress;
      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity.toString();
      }
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  const fadeOut = useCallback((duration = 550) => {
    if (isFadingOutRef.current) return;
    isFadingOutRef.current = true;
    cancelAnimation();
    const video = videoRef.current;
    if (!video) return;

    const start = performance.now();
    const initialOpacity = parseFloat(video.style.opacity || '1') || 1;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = initialOpacity * (1 - progress);
      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity.toString();
      }
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    fadeIn(500);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const remainingTime = video.duration - video.currentTime;
    if (remainingTime <= 0.55 && !isFadingOutRef.current) {
      fadeOut(550);
    }
  };

  const handleEnded = () => {
    isFadingOutRef.current = false;
    if (Array.isArray(src)) {
      setCurrentIndex((prev) => (prev + 1) % src.length);
    } else {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadeIn(500);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.style.opacity = '0';
      isFadingOutRef.current = false;
      video.load();
    }
    return () => {
      cancelAnimation();
    };
  }, [currentSrc]);

  return (
    <video
      ref={videoRef}
      src={currentSrc}
      className={className}
      style={{
        opacity: 0,
        ...style
      }}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
};
