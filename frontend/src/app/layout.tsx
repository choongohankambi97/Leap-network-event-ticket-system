import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "LEAP NETWORKS – FOUNDERS CONNECT | Official Ticket Booking",
  description: "Join top founders, investors, and business leaders on 10 October 2026 at August Loft Water Falls. Secure your pass with Lipila Mobile Money & Card payment.",
  keywords: ["LEAP Networks", "Founders Connect", "Zambia Tech", "African Founders", "Lipila Payment", "Event Tickets Lusaka"],
  openGraph: {
    title: "LEAP NETWORKS – FOUNDERS CONNECT (10 October 2026)",
    description: "Get your official pass for LEAP Networks Founders Connect. Featuring Dr David Nama, Kenneth Obiajulu, Peter Nyumbu, Zindaba Hanzala, and Mr Njekwa Anamela.",
    images: [
      {
        url: "/assets/founders-connect-poster.jpg",
        width: 1200,
        height: 630,
        alt: "LEAP Networks Founders Connect Poster",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#FAF6F0] text-[#1A1715] antialiased selection:bg-[#E25619] selection:text-white">
        {children}
      </body>
    </html>
  );
}
