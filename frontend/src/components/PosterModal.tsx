"use client";

import React from "react";
import { X, Download, ExternalLink } from "lucide-react";
import Image from "next/image";

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-[#E8DACB] shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#E8DACB] flex items-center justify-between bg-[#FAF6F0]">
          <div>
            <h3 className="font-editorial font-bold text-base sm:text-lg text-[#1A1715]">
              LEAP Networks – Founders Connect Poster
            </h3>
            <p className="text-[11px] sm:text-xs text-[#78716C]">
              Official visual identity and event artwork
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/assets/founders-connect-poster.jpg"
              download="LEAP-Founders-Connect-Poster.jpg"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF0E6] text-[#1A1715] border border-[#E8DACB] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#E25619]" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-[#78716C] hover:bg-[#FAF0E6] hover:text-[#1A1715] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Image Container */}
        <div className="p-2 sm:p-4 overflow-y-auto flex items-center justify-center bg-[#1A1715]/5">
          <div className="relative max-w-full rounded-2xl overflow-hidden shadow-lg border border-[#E8DACB]">
            <img
              src="/assets/founders-connect-poster.jpg"
              alt="LEAP Networks Founders Connect Poster"
              className="w-auto max-h-[65vh] sm:max-h-[72vh] object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#FAF6F0] border-t border-[#E8DACB] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#78716C] gap-1 sm:gap-0">
          <span>Date: 10 October 2026 • August Loft Water Falls</span>
          <span className="font-semibold text-[#1A1715]">Charges: K500 • Inquiries: 0979333751</span>
        </div>

      </div>
    </div>
  );
};
