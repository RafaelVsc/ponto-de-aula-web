import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

type ParallaxOptions = {
  strengthX?: number;
  strengthY?: number;
  scale?: number;
  smoothing?: number;
};

export function useParallaxBackground(options: ParallaxOptions = {}) {
  const { strengthX = 14, strengthY = 10, scale = 1.08, smoothing = 0.08 } = options;

  const bgRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const settingsRef = useRef({ strengthX, strengthY, scale, smoothing });

  settingsRef.current = { strengthX, strengthY, scale, smoothing };

  const [enabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    return !prefersReducedMotion && hasFinePointer && supportsHover;
  });

  const applyParallax = () => {
    const element = bgRef.current;
    if (!element) return;

    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;

    const { smoothing: smooth, scale: scaleValue } = settingsRef.current;

    currentRef.current.x += dx * smooth;
    currentRef.current.y += dy * smooth;

    element.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) scale(${scaleValue})`;

    if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
      frameRef.current = null;
      return;
    }

    frameRef.current = requestAnimationFrame(applyParallax);
  };

  const handleParallax = (event: MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const { innerWidth, innerHeight } = window;
    const { strengthX: sX, strengthY: sY } = settingsRef.current;

    targetRef.current = {
      x: ((event.clientX - innerWidth / 2) / innerWidth) * sX,
      y: ((event.clientY - innerHeight / 2) / innerHeight) * sY,
    };

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(applyParallax);
    }
  };

  const resetParallax = () => {
    if (!enabled) return;

    targetRef.current = { x: 0, y: 0 };
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(applyParallax);
    }
  };

  useEffect(() => {
    const element = bgRef.current;
    if (!element) return;

    element.style.transform = `translate3d(0px, 0px, 0) scale(${settingsRef.current.scale})`;
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { bgRef, enabled, handleParallax, resetParallax };
}

