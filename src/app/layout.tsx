import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '../components/AppShell.tsx';
import { Toaster } from 'sonner'; // Sonner toaster import kora holo

export const metadata: Metadata = {
  title: 'StudioSpace | Peer-to-Peer Creative Workspaces',
  description:
    'Peer-to-peer creative workspace platform for booking photo studios, sound stages, podcast rooms, and art workshops.',
  openGraph: {
    title: 'StudioSpace | Peer-to-Peer Creative Workspaces',
    description: 'Book vetted photo studios, sound stages, podcast rooms, and art workshops directly from creators.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

// Applies the saved light theme before the first paint (dark is the default).
const themeScript = `try{if(localStorage.getItem('studiospace_theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        
        {/* Toaster component jate overlap na kore, tar properties set kore add kora holo */}
        <Toaster 
          position="top-right" 
          richColors 
          expand={true} 
          visibleToasts={3} 
          closeButton 
        />
      </body>
    </html>
  );
}