import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  ttfb: number | null;
}

export function usePerformance() {
  useEffect(() => {
    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: 'fcp',
              value: Math.round(entry.startTime)
            });
          }
        }
      });
    });

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        console.log('LCP:', lastEntry.startTime);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'lcp',
            value: Math.round(lastEntry.startTime)
          });
        }
      }
    });

    // Track Interaction to Next Paint (INP) - replaces deprecated FID
    let maxINP = 0;
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const duration = entry.duration;
        if (duration > maxINP) {
          maxINP = duration;
          console.log('INP candidate:', duration);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: 'inp',
              value: Math.round(duration)
            });
          }
        }
      });
    });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value: number };
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      });
    });

    // Track Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      console.log('TTFB:', ttfb);
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'ttfb',
          value: Math.round(ttfb)
        });
      }
    }

    // Start observing
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      inpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const trackCustomMetric = (name: string, value: number) => {
    console.log(`${name}:`, value);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name,
        value: Math.round(value)
      });
    }
  };

  return { trackCustomMetric };
}
