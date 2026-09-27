"use client";

import React, { useRef, useState } from "react";
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { TicketDetails } from "../lib/types";

interface DigitalTicketProps {
  ticket: TicketDetails;
  onBackToEvent: () => void;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({ ticket, onBackToEvent }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(ticket.ticketToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Dynamic import to support client-side rendering
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      if (!ticketRef.current) return;

      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#FAF6F0"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 15, imgWidth, imgHeight);
      pdf.save(`LEAP-Founders-Connect-Ticket-${ticket.ticketToken}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      // Fallback: trigger standard browser print dialog
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Success Banner */}
      <div className="text-center mb-8 no-print animate-fade-in">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>PAYMENT SUCCESSFUL</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-5xl font-black text-[#1A1715]">
          YOUR TICKET HAS BEEN GENERATED
        </h2>
        <p className="text-sm text-[#78716C] mt-2">
          An official confirmation has been assigned to your reference. Save, download, or print your pass below.
        </p>
      </div>

      {/* Action Buttons Toolbar (Hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          id="download-ticket-btn"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#E25619] hover:bg-[#C0420E] text-white text-sm font-bold tracking-wide shadow-md shadow-[#E25619]/25 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? "Generating PDF..." : "DOWNLOAD TICKET (PDF)"}</span>
        </button>

        <button
          onClick={handlePrint}
          id="print-ticket-btn"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF0E6] text-[#1A1715] text-sm font-bold border border-[#E8DACB] shadow-sm transition-all"
        >
          <Printer className="w-4 h-4 text-[#D9931E]" />
          <span>PRINT TICKET</span>
        </button>

        <button
          onClick={onBackToEvent}
          className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#FAF0E6] text-[#78716C] text-sm font-semibold border border-[#E8DACB] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO EVENT</span>
        </button>
      </div>

      {/* Printable Digital Ticket Element */}
      <div
        id="printable-ticket-section"
        ref={ticketRef}
        className="bg-white rounded-3xl border-2 border-[#E8DACB] shadow-2xl overflow-hidden max-w-2xl mx-auto relative"
      >
        {/* Top Header Card (Poster-inspired) */}
        <div className="bg-gradient-to-r from-[#C0420E] via-[#E25619] to-[#D9931E] p-5 sm:p-8 text-white relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full border-4 border-white/10 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-editorial text-xl sm:text-3xl font-black tracking-widest">
                LEAP
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                NETWORKS
              </span>
            </div>
            
            <div className="flex items-center space-x-1 bg-white/15 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
              <span>OFFICIAL PASS</span>
            </div>
          </div>

          <h3 className="font-editorial text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight mb-2">
            FOUNDERS CONNECT
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold text-white/90 pt-2 border-t border-white/20">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>10 OCTOBER 2026</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>12:00 PM – 10:00 PM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>August Loft Water Falls</span>
            </div>
          </div>
        </div>

        {/* Perforated Edge Visual Divider */}
        <div className="relative py-2 bg-[#FAF6F0]">
          <div className="perforation-line-h w-full h-1" />
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF6F0] border-r-2 border-[#E8DACB]" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF6F0] border-l-2 border-[#E8DACB]" />
        </div>

        {/* Ticket Body: Holder & Payment Specs */}
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#78716C]">TICKET HOLDER</p>
              <p className="text-sm sm:text-base font-bold text-[#1A1715] mt-0.5">{ticket.customerName}</p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#78716C]">EMAIL</p>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1715] mt-0.5 break-all">{ticket.customerEmail}</p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#78716C]">QUANTITY</p>
              <p className="text-xs sm:text-sm font-bold text-[#1A1715] mt-0.5">
                {ticket.quantity} {ticket.quantity === 1 ? "Delegate Pass" : "Delegate Passes"}
              </p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#78716C]">AMOUNT PAID</p>
              <p className="text-sm sm:text-base font-black text-[#E25619] mt-0.5">
                K{ticket.amountPaid.toLocaleString()} <span className="text-[11px] text-[#78716C] font-normal">({ticket.currency})</span>
              </p>
            </div>
          </div>

          {/* Status & Reference */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DACB] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#78716C]">PAYMENT STATUS</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black tracking-wider text-green-700 uppercase">
                  {ticket.paymentStatus || "PAID"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-[#78716C]">PAYMENT REFERENCE</p>
              <p className="text-xs font-mono font-semibold text-[#1A1715] mt-0.5 break-all">
                {ticket.paymentReference}
              </p>
            </div>
          </div>

          {/* Ticket Token & QR Code Section */}
          <div className="pt-4 border-t border-[#F0E6DA] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            
            <div className="space-y-3 text-center sm:text-left flex-1 w-full">
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-widest font-black text-[#E25619]">
                  UNIQUE TICKET TOKEN
                </p>
                <div className="inline-flex items-center space-x-2 mt-1 px-3 sm:px-4 py-2 rounded-xl bg-[#FAF0E6] border border-[#E25619]/30">
                  <span className="font-mono text-base sm:text-lg md:text-xl font-black text-[#1A1715] tracking-wider">
                    {ticket.ticketToken}
                  </span>
                  <button
                    onClick={handleCopyToken}
                    title="Copy token"
                    className="p-1 rounded-md hover:bg-white text-[#78716C] transition-colors"
                  >
                    {copiedToken ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] text-[#78716C] leading-snug max-w-xs mx-auto sm:mx-0">
                Present this QR code or Token at the registration desk at August Loft Water Falls on 10 October 2026.
              </p>
            </div>

            {/* QR Code Graphic */}
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E8DACB] shadow-sm flex flex-col items-center shrink-0">
              <QRCodeSVG
                value={ticket.qrPayload || ticket.ticketToken}
                size={120}
                level="H"
                includeMargin={true}
                fgColor="#1A1715"
                bgColor="#FFFFFF"
              />
              <span className="text-[9px] font-mono tracking-wider text-[#78716C] mt-1 uppercase">
                Scan to Verify
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Footer Note */}
        <div className="bg-[#FAF6F0] p-4 text-center border-t border-[#E8DACB] text-[11px] text-[#78716C]">
          LEAP NETWORKS • August Loft Water Falls • Inquiries: 0979333751 • connect@leapnetworks.org
        </div>

      </div>

    </div>
  );
};
