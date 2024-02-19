import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ICON from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BG from "@/assets/bg.jpg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TensionCode",
  description: "CodeGen Experience",
  icons: {
    icon: ICON.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn`font-san overflow-clip bg-slate-900/60`}>
        <Image
          src={BG}
          alt="Background"
          className="fixed inset-0 z-[-1] h-full w-auto object-cover blur-[10px] filter"
          width={1920}
          height={1080}
        />
        <Image
          src="/logo.svg"
          alt="TensionCode Logo"
          className="fixed left-4 top-4 z-10 size-24"
          width={128}
          height={128}
          priority
        />
        {children}
        <Toaster />
        {/* <script
          src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js"
          defer
        ></script>
        <script
          src="http://flowchart.js.org/flowchart-latest.js"
          defer
        ></script> */}
      </body>
    </html>
  );
}
