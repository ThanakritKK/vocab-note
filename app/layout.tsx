import { ClerkProvider } from "@clerk/nextjs";
import {Noto_Sans_Thai} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Toaster } from "sonner"

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vocab-note-xi.vercel.app"),
  title: {
    template: "%s | VocabNote",
    default: "VocabNote - แอปจดศัพท์อัจฉริยะ",
  },
  description: "จดศัพท์ ท่องจำ และเก่งภาษาอังกฤษไปด้วยกัน ด้วยระบบ AI และ Spaced Repetition",

  keywords: ["จดศัพท์", "เรียนภาษาอังกฤษ", "ท่องศัพท์", "Flashcard", "Vocab App", "TOEIC"],

  openGraph: {
    title: "VocabNote - แอปจดศัพท์อัจฉริยะ",
    description: "แอปจดศัพท์ที่ช่วยให้คุณจำแม่นขึ้น 300% ด้วยฟีเจอร์ AI และ Spaced Repetition",
    url: "https://vocab-note-xi.vercel.app",
    siteName: "VocabNote",
    images: [
      {
        url: "/opengraph-image.png", // เดี๋ยวเราจะไปสร้างไฟล์นี้กัน
        width: 1200,
        height: 630,
        alt: "VocabNote Preview",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VocabNote - แอปจดศัพท์อัจฉริยะ",
    description: "เลิกจดใส่กระดาษ แล้วมาจดใน VocabNote กันเถอะ",
    images: ["/opengraph-image.png"], // ใช้รูปเดียวกับ OG
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${notoSansThai.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right"/>
      </body>
    </html>
    </ClerkProvider>
  );
}
