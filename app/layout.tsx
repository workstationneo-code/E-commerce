import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'VOLT — Electrical, thoughtfully selected', description: 'Lighting, switches and electrical essentials for considered spaces.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
