import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YumYum Toddler: ไอเดียเมนูหนูน้อย 1.8 ขวบ (20 เดือน)",
  description: "เว็บแอปพลิเคชันค้นหาและสุ่มไอเดียเมนูอาหารสำหรับเด็กวัยเตาะแตะ 1.8 ขวบ โภชนาการครบถ้วน ปลอดภัยจากอาหารติดคอ เหมาะกับคุณพ่อคุณแม่ที่เวลาน้อย",
  keywords: ["อาหารเด็ก 1 ขวบ", "เมนูเด็ก 20 เดือน", "เมนูเด็ก 1.8 ขวบ", "BLW", "Finger food เด็ก", "เด็กกินยาก"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFDF9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#FFFDF9] text-[#33261D]">
        {children}
      </body>
    </html>
  );
}
