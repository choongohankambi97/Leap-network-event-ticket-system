"use client";

import React from "react";
import { Handshake } from "lucide-react";

export const PartnersBanner: React.FC = () => {
  const partners = [
    { name: "MULIMI", subtitle: "We are sustainable Agriculture", icon: "🌱" },
    { name: "NK", subtitle: "Nkonde & Kapingula Legal Practitioners", icon: "⚖️" },
    { name: "Biroc", subtitle: "Corporations", icon: "🏢" },
    { name: "SB", subtitle: "Solly & Brothers - Progress in Motion", icon: "🚀" },
    { name: "Ignis Globus", subtitle: "Global Energy & Infrastructure", icon: "🌐" },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E8DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-[#78716C] flex items-center space-x-1.5">
            <Handshake className="w-3.5 h-3.5 text-[#E25619]" />
            <span>ORGANIZATIONAL & STRATEGIC PARTNERS</span>
          </span>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center justify-center mb-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF6F0]/80 border border-[#E8DACB] flex flex-col items-center text-center hover:bg-[#FAF0E6] transition-colors"
            >
              <span className="text-2xl mb-1">{partner.icon}</span>
              <p className="font-editorial font-black text-sm sm:text-base text-[#1A1715] tracking-wider">
                {partner.name}
              </p>
              <p className="text-[10px] text-[#78716C] font-medium mt-0.5 leading-tight line-clamp-2">
                {partner.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Updated Poster Bottom Banner: Contact & Leapnetworks Social Links */}
        <div className="rounded-2xl bg-[#FAF0E6] border border-[#E8DACB] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#1A1715]">
            <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">More Info:</span>
            <a href="tel:0979333751" className="inline-flex items-center space-x-1.5 text-[#E25619] hover:underline">
              <span>📞</span>
              <span>0979333751</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold text-[#1A1715]">
            {/* Social Icons Strip matching poster */}
            <div className="flex items-center space-x-1.5 text-white">
              <span className="w-6 h-6 rounded-full bg-[#1A1715] flex items-center justify-center text-[10px] font-bold" title="Twitter / X">𝕏</span>
              <span className="w-6 h-6 rounded-full bg-[#1A1715] flex items-center justify-center text-[11px] font-bold" title="Facebook">f</span>
              <span className="w-6 h-6 rounded-full bg-[#1A1715] flex items-center justify-center text-[10px] font-bold" title="Instagram">📸</span>
              <span className="w-6 h-6 rounded-full bg-[#1A1715] flex items-center justify-center text-[10px] font-bold" title="YouTube">▶</span>
            </div>
            <span className="font-bold text-sm tracking-wide font-editorial italic text-[#1A1715]">
              Leapnetworks
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
