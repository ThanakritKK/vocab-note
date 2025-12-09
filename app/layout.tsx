import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter , Noto_Sans_Thai} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Vocab Note App",
  description: "App จดศัพท์สำหรับคนเก่ง",
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
      </body>
    </html>
    </ClerkProvider>
  );
}
