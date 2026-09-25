import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'https://hor-aksara-reader.prong-naruebest.chatgpt.site'),
  title: 'หออักษรา · คลังเรื่องเล่าส่วนตัว',
  description: 'พื้นที่อ่านนิยายภาษาไทยที่สงบ เป็นส่วนตัว และออกแบบเพื่อการอ่านระยะยาว',
  applicationName: 'หออักษรา',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    title: 'หออักษรา · คลังเรื่องเล่าส่วนตัว',
    description: 'พื้นที่อ่านนิยายภาษาไทยที่สงบ เป็นส่วนตัว และออกแบบเพื่อการอ่านระยะยาว',
    images: [{ url:'/og.png', width:1200, height:630, alt:'หออักษรา คลังเรื่องเล่าส่วนตัว' }],
  },
  twitter: { card:'summary_large_image', title:'หออักษรา · คลังเรื่องเล่าส่วนตัว', description:'พื้นที่อ่านนิยายภาษาไทยที่สงบ เป็นส่วนตัว และออกแบบเพื่อการอ่านระยะยาว', images:['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
