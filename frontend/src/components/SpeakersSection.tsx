"use client";

import React from "react";
import { User, Award, ArrowUpRight } from "lucide-react";

interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  roleBadge: string;
  themeColor: string;
  accentHex: string;
  gradientBg: string;
  bioSnippet: string;
}

const SPEAKERS: SpeakerItem[] = [
  {
    id: "dr-david-nama",
    name: "Dr David Nama",
    title: "CHAIRMAN",
    organization: "DANA GROUP",
    roleBadge: "Industrial Pioneer",
    themeColor: "from-amber-600 to-amber-700",
    accentHex: "#D97706",
    gradientBg: "bg-[#D97706]",
    bioSnippet: "Distinguished industrialist steering diversified conglomerates and large-scale enterprise expansions across Zambia.",
  },
  {
    id: "kenneth-obiajulu",
    name: "Kenneth Obiajulu",
    title: "CO-FOUNDER",
    organization: "AGRICOP",
    roleBadge: "AgriTech Leader",
    themeColor: "from-yellow-500 to-amber-500",
    accentHex: "#F59E0B",
    gradientBg: "bg-[#F59E0B]",
    bioSnippet: "Revolutionizing commercial agricultural supply chains, food security, and technology-driven agro-processing.",
  },
  {
    id: "peter-nyumbu",
    name: "Peter Nyumbu",
    title: "BUSINESS STRATEGIST",
    organization: "GROWTH ADVISORY",
    roleBadge: "Strategy & Scale",
    themeColor: "from-orange-600 to-orange-700",
    accentHex: "#EA580C",
    gradientBg: "bg-[#EA580C]",
    bioSnippet: "Renowned advisor specializing in market penetration, corporate governance, and sustainable venture scaling.",
  },
  {
    id: "zindaba-hanzala",
    name: "Zindaba Hanzala",
    title: "FOUNDER",
    organization: "MULIMI",
    roleBadge: "Ecosystem Builder",
    themeColor: "from-orange-500 to-amber-600",
    accentHex: "#F97316",
    gradientBg: "bg-[#F97316]",
    bioSnippet: "Trailblazing innovator empowering grassroots agricultural markets and sustainable female-led agribusiness initiatives.",
  },
  {
    id: "mr-njekwa-anamela",
    name: "Mr Njekwa Anamela",
    title: "LEAP CHAIRMAN",
    organization: "LEAP NETWORKS",
    roleBadge: "Host & Visionary",
    themeColor: "from-amber-600 to-orange-600",
    accentHex: "#D97706",
    gradientBg: "bg-[#C2410C]",
    bioSnippet: "Visionary convener driving high-impact technology networks, leadership ecosystems, and African founder collaboration.",
  },
];

export const SpeakersSection: React.FC = () => {
  return (
    <section id="speakers" className="py-20 bg-gradient-to-b from-[#FAF6F0] to-[#F5ECE1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E25619]">
              Featured Keynotes & Panelists
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#1A1715] mt-2">
              MEET THE SPEAKERS
            </h2>
            <p className="text-[#78716C] mt-3 text-sm sm:text-base">
              Learn directly from top business luminaries who are shaping industries, creating employment, and driving continental growth.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full bg-white border border-[#E8DACB] text-[#1A1715]">
              <Award className="w-4 h-4 text-[#D9931E]" />
              <span>5 Distinguished Voices</span>
            </span>
          </div>
        </div>

        {/* 5-Column Vertical Strip Layout (Mirroring the Event Poster Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {SPEAKERS.map((speaker, index) => (
            <div
              key={speaker.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E8DACB] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Colorful Poster-style Header Strip */}
              <div
                className={`w-full h-44 sm:h-52 ${speaker.gradientBg} relative p-4 flex flex-col justify-between overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
              >
                {/* Background Pattern Graphic */}
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border-4 border-white/20 pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full border-4 border-white/10 pointer-events-none" />

                {/* Top Badge */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-sm text-white">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                    {speaker.roleBadge}
                  </span>
                </div>

                {/* Speaker Avatar Icon Silhouette / Monogram */}
                <div className="z-10 self-center my-auto flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-inner">
                    <User className="w-8 h-8" />
                  </div>
                </div>

                {/* Bottom Title on Color Band */}
                <div className="z-10 text-white">
                  <p className="text-[11px] font-black uppercase tracking-wider opacity-90 leading-tight">
                    {speaker.title}
                  </p>
                  <p className="text-[12px] font-black tracking-wider uppercase text-white/95">
                    {speaker.organization}
                  </p>
                </div>
              </div>

              {/* Lower White Card Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial text-lg sm:text-xl font-black text-[#1A1715] group-hover:text-[#E25619] transition-colors">
                    {speaker.name}
                  </h3>
                  <div className="w-8 h-0.5 bg-[#E25619] my-2.5 rounded-full" />
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {speaker.bioSnippet}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0E6DA] flex items-center justify-between text-[11px] font-semibold text-[#78716C]">
                  <span>Founders Connect 2026</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E25619] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
