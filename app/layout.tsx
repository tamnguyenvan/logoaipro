import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogoAIPro - AI-Powered Logo Generator | Create Professional Logos Instantly",
  description: "Transform your brand with LogoAIPro's AI-powered logo generator. Create unique, professional logos in minutes. Perfect for businesses, startups, and personal brands.",
  keywords: "AI logo generator, logo design, artificial intelligence, brand identity, logo maker, professional logos, LogoAIPro",
  authors: [{ name: "LogoAIPro" }],
  creator: "LogoAIPro",
  publisher: "LogoAIPro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://logoaipro.com',
    siteName: 'LogoAIPro',
    title: 'LogoAIPro - Create Professional Logos with AI',
    description: 'Generate unique, professional logos instantly with our AI-powered logo maker. Perfect for businesses of all sizes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LogoAIPro - AI Logo Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogoAIPro - AI Logo Generator',
    description: 'Create professional logos instantly with AI technology',
    images: ['/twitter-image.png'],
    creator: '@logoaipro',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://logoaipro.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}