import type {Metadata} from 'next';
import './globals.css';
import {StoreProvider} from '../components/store-provider';
export const metadata:Metadata={title:'VOLT — Electrical products online',description:'Shop lighting, LED bulbs, switches, sockets and electrical essentials online.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><StoreProvider>{children}</StoreProvider></body></html>}