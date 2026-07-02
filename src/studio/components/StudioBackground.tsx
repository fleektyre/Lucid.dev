import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface StudioBackgroundProps {
  src: string;
}

export const StudioBackground: React.FC<StudioBackgroundProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const FADE_DURATION = 350; // ms
  const FADE_OUT_LEAD = 0.55; // seconds before end
  const MAX_OPACITY = 0.9; // Cinematic opacity for readability

  const animateFade = (targetOpacity: number) => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    const startTime = performance.now();
    const startOpacity = opacityRef.current;

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);
      
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      opacityRef.current = currentOpacity;

      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity.toString();
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct initialization
    video.style.opacity = '0';
    opacityRef.current = 0;
    fadingOutRef.current = false;

    // Autoplay configuration
    video.muted = true;
    video.autoplay = true;
    video.setAttribute('muted', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('autoplay', 'true');

    let hls: Hls | null = null;

    const tryPlay = () => {
      video.play()
        .then(() => {
          animateFade(MAX_OPACITY);
        })
        .catch((err) => {
          console.warn("Autoplay was prevented, showing anyway:", err);
          // Still show the background even if autoplay is blocked
          animateFade(MAX_OPACITY);
        });
    };

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          maxMaxBufferLength: 10,
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryPlay();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support (Safari)
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          tryPlay();
        });
      }
    } else {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        tryPlay();
      });
      tryPlay();
    }

    const checkTime = () => {
      if (!video) return;
      
      const timeLeft = video.duration - video.currentTime;
      
      // fade-out begins when 0.55s remain
      if (!fadingOutRef.current && timeLeft <= FADE_OUT_LEAD && video.duration > 0) {
        fadingOutRef.current = true;
        animateFade(0);
      }
      
      requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      opacityRef.current = 0;
      fadingOutRef.current = false;
      
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play()
          .then(() => {
            animateFade(MAX_OPACITY);
          })
          .catch(() => {
            animateFade(MAX_OPACITY);
          });
      }, 100);
    };

    // Retry play on user interaction anywhere on document (bypasses autoplay restriction)
    const handleUserInteraction = () => {
      if (video && video.paused) {
        video.play()
          .then(() => {
            animateFade(MAX_OPACITY);
          })
          .catch(() => {});
      }
    };

    video.addEventListener('ended', handleEnded);
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    const timeCheckId = requestAnimationFrame(checkTime);

    return () => {
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      cancelAnimationFrame(timeCheckId);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050505]">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover object-[center_top]"
        style={{ opacity: 0 }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />
    </div>
  );
};
