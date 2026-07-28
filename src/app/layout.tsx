import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { ToastContainer } from "@/components/ui/toast";
import { Confetti } from "@/components/ui/confetti";

export const metadata: Metadata = {
  title: "Panthi Dental Clinic | Trusted Dental Care in Ghorahi, Nepal",
  description:
    "Experience world-class dental care at Panthi Dental Clinic in Ghorahi, Nepal. General dentistry, orthodontics, implants, whitening, and more. Book your appointment today!",
  keywords:
    "dental clinic Ghorahi, dentist Dang, Panthi Dental, teeth whitening, braces, dental implants, root canal, Nepal dentist",
  openGraph: {
    title: "Panthi Dental Clinic | Trusted Dental Care in Ghorahi",
    description:
      "Modern dental care with a gentle touch. Book your appointment today!",
    type: "website",
    locale: "en_US",
    siteName: "Panthi Dental Clinic",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <ToastContainer />
        <Confetti />
      </body>
    </html>
  );
}
