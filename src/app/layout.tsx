import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/provider/ReduxProvider";
import { Header } from "@/components/organisms/global/header/Header";
import { Footer } from "@/components/organisms/global/footer/Footer";
import { Toaster } from "sonner";
export const dynamic = "force-dynamic";
//testing
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MVP build for AI Local project",
  description: "An MVP build for AI Local project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased font-poppins sm:min-h-screen sm:grid sm:grid-rows-[auto_1fr_auto]`}
      >
        <ReduxProvider>
          <Header />
          <main className="min-h-0 pt-14">{children}</main>
          <Footer />
        </ReduxProvider>
        <Toaster position="top-center" duration={3000} richColors />
      </body>
    </html>
  );
}
