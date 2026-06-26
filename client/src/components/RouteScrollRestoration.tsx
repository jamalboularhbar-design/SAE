import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/** Fixed marketing nav height + breathing room */
const NAV_OFFSET = 72;

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) {
    scrollToTop();
    return;
  }

  const tryScroll = (attempt = 0) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      return;
    }
    if (attempt < 8) {
      requestAnimationFrame(() => tryScroll(attempt + 1));
    } else {
      scrollToTop();
    }
  };

  tryScroll();
}

/**
 * Resets scroll on SPA navigation so every route starts at the top (or hash target).
 * Wouter does not restore scroll by default — without this, users land mid-page.
 */
export default function RouteScrollRestoration() {
  const [location] = useLocation();
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const pathname = location.split('#')[0] || '/';
    const hash = window.location.hash;
    const key = `${pathname}${hash}`;
    const prev = prevRef.current;
    prevRef.current = key;

    if (prev === key) return;

    if (hash) {
      requestAnimationFrame(() => scrollToHash(hash));
    } else {
      scrollToTop();
    }
  }, [location]);

  return null;
}
