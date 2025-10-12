import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
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
          // Send to analytics
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
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'lcp',
            value: Math.round(lastEntry.startTime)
          });
        }
      }
    });

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'fid',
            value: Math.round(entry.processingStart - entry.startTime)
          });
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
      // Send to analytics
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
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Function to manually track custom metrics
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