import SkillPolygon from '@/components/SkillPolygon';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your life happens in seasons',
  description: 'Use this tool to approximate the changes, progress, time spent.',
  openGraph: {
    title: 'Your life happens in seasons',
    description: 'Use this tool to approximate the changes, progress, time spent.',
    images: [
      {
        url: '/og-image-dark.png', // Replace with your image path in the public folder
        width: 1200,
        height: 630,
        alt: 'Your life happens in seasons',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your life happens in seasons',
    description: 'Use this tool to approximate the changes, progress, time spent.',
    images: ['/og-image-dark.png'], // Replace with your image path
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SkillPolygon />
    </main>
  );
}