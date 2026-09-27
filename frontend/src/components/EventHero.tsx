"use client";

import React from "react";
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, ShieldCheck, Ticket } from "lucide-react";

interface EventHeroProps {
  onGetTicketClick: () => void;
  onOpenPoster: () => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  onGetTicketClick,
  onOpenPoster,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-mandala-texture">
      {/* Decorative Warm Geometric Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#E25619]/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#D9931E]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Top Organization Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E8DACB] text-[#C0420E] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D9931E]" />
            <span>LEAP NETWORKS PRESENTS</span>
          </div>

          {/* Editorial Grand Title */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1A1715] uppercase leading-[1.08] mb-4">
            FOUNDERS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E25619] via-[#D9931E] to-[#E25619]">
              CONNECT
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#57534E] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            The premier gathering for trailblazing founders, business strategists, and investors driving the new frontier of African enterprise.
          </p>

          {/* Event Quick Pill Details matching Poster */}
          <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 sm:p-3 rounded-2xl bg-white/80 border border-[#E8DACB] shadow-sm backdrop-blur-sm mb-10 text-left">
            {/* Date */}
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-[#FAF6F0]/80">
              <div className="w-10 h-10 rounded-lg bg-[#E25619]/10 text-[#E25619] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Date</p>
                <p className="text-sm sm:text-base font-bold text-[#1A1715]">10th October, 2026</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-[#FAF6F0]/80">
              <div className="w-10 h-10 rounded-lg bg-[#D9931E]/10 text-[#D9931E] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Time</p>
                <p className="text-sm sm:text-base font-bold text-[#1A1715]">12:00 PM – 10:00 PM</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-[#FAF6F0]/80">
              <div className="w-10 h-10 rounded-lg bg-[#E25619]/10 text-[#E25619] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">Venue</p>
                <p className="text-sm sm:text-base font-bold text-[#1A1715]">August Loft Water Falls</p>
              </div>
            </div>
          </div>

          {/* Pricing Highlight & CTA Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Price Pill */}
            <div className="inline-flex items-center space-x-3 px-6 py-3.5 rounded-full bg-[#FAF0E6] border border-[#E25619]/30 text-[#1A1715]">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C0420E]">Admission Fee:</span>
              <span className="font-editorial text-2xl font-black text-[#E25619]">K500</span>
              <span className="text-xs text-[#78716C] font-medium">/ person</span>
            </div>

            {/* Main Action Button */}
            <button
              onClick={onGetTicketClick}
              id="hero-get-ticket-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-[#E25619] hover:bg-[#C0420E] text-white text-base font-bold tracking-wider uppercase shadow-lg shadow-[#E25619]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Ticket className="w-5 h-5" />
              <span>GET YOUR TICKET</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Guarantee Note */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#78716C]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Secured by <strong>Lipila Gateway</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>⚡ Instant QR Digital Pass</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>📱 Mobile Money & Card Supported</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
