"use client";

import React from "react";
import { Calendar, Clock, MapPin, Tag, Phone, Mail, CheckCircle, Navigation, Users } from "lucide-react";

export const EventInformation: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#FAF6F0] border-t border-[#E8DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E25619]">
            Event Essentials
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#1A1715] mt-2">
            CONVERGE, CONNECT, CATALYZE
          </h2>
          <p className="text-[#78716C] mt-3 text-sm sm:text-base">
            Everything you need to know about the LEAP Networks Founders Connect summit.
          </p>
        </div>

        {/* 4-Card Grid of Primary Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Date & Time */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DACB] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#E25619] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1715] mb-1">Date & Time</h3>
            <p className="text-sm font-semibold text-[#E25619] mb-2">10th October, 2026</p>
            <p className="text-xs text-[#78716C] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#D9931E]" />
              <span>12:00 PM – 10:00 PM (Full Day)</span>
            </p>
          </div>

          {/* Venue */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DACB] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#D9931E] flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1715] mb-1">Venue Location</h3>
            <p className="text-sm font-semibold text-[#1A1715] mb-2">August Loft Water Falls</p>
            <p className="text-xs text-[#78716C] flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-[#E25619]" />
              <span>Lusaka, Zambia</span>
            </p>
          </div>

          {/* Ticket Price */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DACB] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#E25619] flex items-center justify-center mb-4">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1715] mb-1">Ticket Price</h3>
            <p className="text-2xl font-black font-editorial text-[#E25619] mb-1">K500</p>
            <p className="text-xs text-[#78716C]">
              Includes full day access, keynote panels, and evening networking dinner.
            </p>
          </div>

          {/* Direct Contact */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DACB] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#D9931E] flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1715] mb-1">Official Inquiries</h3>
            <a
              href="tel:0979333751"
              className="text-base font-bold text-[#E25619] hover:underline block mb-1"
            >
              0979333751
            </a>
            <p className="text-xs text-[#78716C] flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-[#78716C]" />
              <span>connect@leapnetworks.org</span>
            </p>
          </div>

        </div>

        {/* Detailed Experience Breakdown */}
        <div className="rounded-3xl bg-[#FAF0E6]/70 border border-[#E8DACB] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-1">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C0420E]">
                Why Attend
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1715] mt-2 mb-4">
                What Your Pass Unlocks
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                Founders Connect is curated for Zambia&apos;s most ambitious entrepreneurs, corporate executives, and ecosystem enablers to forge game-changing partnerships.
              </p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#1A1715] bg-white/80 py-2.5 px-4 rounded-xl border border-[#E8DACB] w-fit">
                <Users className="w-4 h-4 text-[#E25619]" />
                <span>Limited Seating • Verified Admission Only</span>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E8DACB]/80 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1A1715]">Executive Keynotes & Panels</h4>
                  <p className="text-xs text-[#78716C] mt-1">Direct insights from high-growth enterprise leaders across Dana Group, Agricop, and Mulimi.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8DACB]/80 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1A1715]">Strategic Deal-Making</h4>
                  <p className="text-xs text-[#78716C] mt-1">Structured 1-on-1 breakout sessions with investors, strategic partners, and legal advisors.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8DACB]/80 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1A1715]">Dinner & Evening Mixer</h4>
                  <p className="text-xs text-[#78716C] mt-1">Unwind at August Loft Water Falls with catered refreshments, dinner, and cocktails.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8DACB]/80 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1A1715]">Instant Digital QR Pass</h4>
                  <p className="text-xs text-[#78716C] mt-1">Tamper-proof verifiable digital ticket issued immediately upon payment confirmation.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
