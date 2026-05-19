import { NavNew } from '@/components/layout/NavNew';
import { FooterNew } from '@/components/layout/FooterNew';
import { Disclaimer } from '@/components/layout/Disclaimer';

interface LayoutNewProps {
  children: React.ReactNode;
}

export const LayoutNew = ({ children }: LayoutNewProps) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavNew />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Disclaimer />
      <FooterNew />
    </div>
  );
};
