import React, { useRef, useEffect, useState } from 'react';

interface StudioBackgroundProps {
  src: string;
}

export const StudioBackground: React.FC<StudioBackgroundProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafId = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const opacity = 0.35; // Soft cinematic background opacity
  const FADE_MS = 1000;
  const FADE_OUT_LEAD = 0.8;

  const fadeTo = (target: number, duration: number) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const video = videoRef.current;
    if (!video) return;

    const startOpacity = parseFloat(video.style.opacity || opacity.toString());
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (target - startOpacity) * progress;
      video.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setHasError(false);
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0'; // Start hidden, fade in nicely
    fadingOutRef.current = false;

    const playOnStart = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          fadeTo(opacity, FADE_MS);
        }).catch(error => {
          if (error.name !== 'AbortError') {
            console.warn("Autoplay was blocked or interrupted:", error);
          }
        });
      }
    };

    playOnStart();

    const handleTimeUpdate = () => {
      if (!fadingOutRef.current && video.duration - video.currentTime <= FADE_OUT_LEAD && video.duration > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      fadingOutRef.current = false;
      fadeTo(opacity, FADE_MS);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  if (hasError) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-zinc-950/40" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050505]">
      <video
        ref={videoRef}
        key={src}
        src={src}
        muted
        playsInline
        autoPlay
        loop={false}
        preload="auto"
        className="absolute top-0 left-1/2 -translate-x-1/2 min-w-full min-h-full object-cover"
        style={{ opacity: 0, transition: 'opacity 1s ease' }}
        onError={() => {
          console.warn("Studio video failed to load:", src);
          setHasError(true);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-60" />
    </div>
  );
};
