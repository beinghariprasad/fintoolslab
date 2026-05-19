import { useEffect } from 'react';

interface AdSenseUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

// AdSense publisher ID (matches ads.txt file)
const ADSENSE_CLIENT = 'ca-pub-7569819903988510';

export const AdSenseUnit = ({ 
  adSlot, 
  adFormat = 'auto',
  className = '',
  style = {} 
}: AdSenseUnitProps) => {

  useEffect(() => {
    // Initialize AdSense
    if (typeof window !== 'undefined') {
      try {
        interface WindowWithAdsbygoogle extends Window {
          adsbygoogle?: Array<Record<string, unknown>>;
        }
        const win = window as WindowWithAdsbygoogle;
        (win.adsbygoogle = win.adsbygoogle || []).push({});
      } catch (error) {
        // Silently handle AdSense errors
        console.warn('AdSense initialization error:', error);
      }
    }
  }, []);

  const minHeightMap: Record<string, string> = {
    auto: '100px',
    rectangle: '250px',
    horizontal: '90px',
    vertical: '600px',
  };

  return (
    <div className={`ad-container ${className}`} style={{ minHeight: minHeightMap[adFormat], ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"

      />
    </div>
  );
};

// Specific ad unit components for different placements
export const HeaderAd = () => (
  <AdSenseUnit
    adSlot="1234567890" // Replace with your actual slot ID
    adFormat="horizontal"
    className="ad-container-horizontal my-4"
  />
);

export const SidebarAd = () => (
  <AdSenseUnit
    adSlot="1234567891" // Replace with your actual slot ID
    adFormat="rectangle"
    className="ad-container sticky top-20"
  />
);

export const FooterAd = () => (
  <AdSenseUnit
    adSlot="1234567892" // Replace with your actual slot ID
    adFormat="horizontal"
    className="ad-container-horizontal my-8"
  />
);

export const InContentAd = () => (
  <AdSenseUnit
    adSlot="1234567893" // Replace with your actual slot ID
    adFormat="rectangle"
    className="ad-container my-8 mx-auto"
  />
);