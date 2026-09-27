"use client";

import React, { useState } from "react";
import { Ticket, Calendar, Phone, Image as ImageIcon, Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenPoster: () => void;
  onScrollToCheckout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPoster, onScrollToCheckout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (action?: () => void) => {
    setMobileMenuOpen(false);
    if (action) action();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DACB]/80 bg-[#FAF6F0]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-editorial text-xl sm:text-2xl font-black tracking-widest text-[#1A1715]">
                LEAP
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#E25619] bg-[#E25619]/10 px-2 py-0.5 rounded">
                NETWORKS
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#78716C] font-medium">
              Founders Connect 2026
            </span>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <nav aria-label="Desktop navigation" className="hidden lg:flex items-center space-x-6 text-sm font-medium text-[#2D2824]">
          <a href="#about" className="hover:text-[#E25619] transition-colors py-1">
            Event Info
          </a>
          <a href="#speakers" className="hover:text-[#E25619] transition-colors py-1">
            Speakers
          </a>
          <button
            onClick={onOpenPoster}
            className="flex items-center space-x-1.5 text-[#2D2824] hover:text-[#E25619] transition-colors py-1"
          >
            <ImageIcon className="w-4 h-4 text-[#D9931E]" />
            <span>View Poster</span>
          </button>
          <a
            href="tel:0979333751"
            className="flex items-center space-x-1.5 text-[#78716C] hover:text-[#1A1715] transition-colors py-1"
          >
            <Phone className="w-3.5 h-3.5 text-[#E25619]" />
            <span>0979333751</span>
          </a>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onScrollToCheckout}
            id="header-buy-ticket-btn"
            className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#E25619] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-[#E25619]/25 hover:bg-[#C0420E] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Get Ticket • K500</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border border-[#E8DACB] bg-white text-[#1A1715] hover:bg-[#FAF0E6] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8DACB] bg-[#FAF6F0] px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-lg">
          <a
            href="#about"
            onClick={() => handleMobileNav()}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1A1715] hover:bg-[#FAF0E6] transition-colors"
          >
            Event Info & Venue
          </a>
          <a
            href="#speakers"
            onClick={() => handleMobileNav()}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1A1715] hover:bg-[#FAF0E6] transition-colors"
          >
            Featured Speakers
          </a>
          <button
            onClick={() => handleMobileNav(onOpenPoster)}
            className="w-full text-left flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1A1715] hover:bg-[#FAF0E6] transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-[#D9931E]" />
            <span>View Official Event Poster</span>
          </button>
          <a
            href="tel:0979333751"
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#E25619] bg-[#FAF0E6] border border-[#E8DACB]"
          >
            <Phone className="w-4 h-4" />
            <span>Hotline: 0979333751</span>
          </a>
        </div>
      )}
    </header>
  );
};
