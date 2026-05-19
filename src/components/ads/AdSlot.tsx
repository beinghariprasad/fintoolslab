import { useEffect } from 'react';

const AD_SIZES: Record<string, { w: number; h: number; label: string }> = {
  leaderboard: { w: 970, h: 90, label: 'Leaderboard · 970x90' },
  billboard: { w: 970, h: 250, label: 'Billboard · 970x250' },
  mrec: { w: 300, h: 250, label: 'Medium rectangle · 300x250' },
  half: { w: 300, h: 600, label: 'Half page · 300x600' },
  native: { w: 0, h: 0, label: 'In-article native' },
};

interface AdSlotProps {
  size?: keyof typeof AD_SIZES;
  client?: string;
  slot?: string;
  layout?: string;
  format?: string;
  showLabel?: boolean;
  containerClass?: string;
}

export function AdSlot({
  size = 'leaderboard',
  client = 'ca-pub-7569819903988510',
  slot = '0000000000',
  layout,
  format = 'auto',
  showLabel = true,
  containerClass = 'ad-slot--inline',
}: AdSlotProps) {
  const meta = AD_SIZES[size] || AD_SIZES.leaderboard;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // swallow in preview
    }
  }, []);

  return (
    <aside className={`ad-slot ${containerClass}`} aria-label="Advertisement">
      {showLabel && <span className="ad-label">Advertisement</span>}
      <div className={`ad-frame ad-${size}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout={layout || undefined}
          data-full-width-responsive="true"
        />
        <div className="ad-fallback" aria-hidden="true">
          <span className="icon">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9 H 21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="size">{meta.label}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>AdSense placement</span>
        </div>
      </div>
    </aside>
  );
}
