"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { EventHero } from "../components/EventHero";
import { EventInformation } from "../components/EventInformation";
import { SpeakersSection } from "../components/SpeakersSection";
import { TicketCheckout } from "../components/TicketCheckout";
import { PaymentStatusModal } from "../components/PaymentStatusModal";
import { DigitalTicket } from "../components/DigitalTicket";
import { PartnersBanner } from "../components/PartnersBanner";
import { PosterModal } from "../components/PosterModal";
import { CreatePaymentDTO, CreatePaymentResponse, TicketDetails } from "../lib/types";
import { Phone, Mail, MapPin, Heart } from "lucide-react";

export default function Home() {
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<CreatePaymentResponse | null>(null);
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [confirmedTicket, setConfirmedTicket] = useState<TicketDetails | null>(null);

  const handleScrollToCheckout = () => {
    if (confirmedTicket) {
      setConfirmedTicket(null);
    }
    const checkoutEl = document.getElementById("checkout");
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePaymentInitiated = (response: CreatePaymentResponse, payload: CreatePaymentDTO) => {
    setCustomerPhone(payload.phone);
    setActivePayment(response);
  };

  const handlePaymentSuccess = (ticket: TicketDetails) => {
    setActivePayment(null);
    setConfirmedTicket(ticket);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToEvent = () => {
    setConfirmedTicket(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1A1715]">
      
      {/* Navigation Header */}
      <Header
        onOpenPoster={() => setIsPosterOpen(true)}
        onScrollToCheckout={handleScrollToCheckout}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {confirmedTicket ? (
          /* When payment is successful, show the digital ticket */
          <div className="animate-fade-in">
            <DigitalTicket
              ticket={confirmedTicket}
              onBackToEvent={handleBackToEvent}
            />
          </div>
        ) : (
          /* Standard Landing & Booking Experience */
          <>
            <EventHero
              onGetTicketClick={handleScrollToCheckout}
              onOpenPoster={() => setIsPosterOpen(true)}
            />

            <PartnersBanner />

            <SpeakersSection />

            <EventInformation />

            <TicketCheckout
              onPaymentInitiated={handlePaymentInitiated}
            />
          </>
        )}
      </div>

      {/* Payment Processing & Polling Modal */}
      {activePayment && (
        <PaymentStatusModal
          paymentData={activePayment}
          customerPhone={customerPhone}
          onSuccess={handlePaymentSuccess}
          onClose={() => setActivePayment(null)}
          onRetry={() => {
            setActivePayment(null);
            handleScrollToCheckout();
          }}
        />
      )}

      {/* Official Poster Viewer Modal */}
      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#1A1715] text-white/80 py-12 border-t border-[#2D2824] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-2xl font-black tracking-widest text-white">
                  LEAP
                </span>
                <span className="text-xs uppercase tracking-widest bg-[#E25619] text-white px-2 py-0.5 rounded font-bold">
                  NETWORKS
                </span>
              </div>
              <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                Empowering entrepreneurship, leadership, and venture building across Africa. Host of Founders Connect 2026.
              </p>
            </div>

            {/* Col 2: Event Details */}
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold tracking-widest text-[#E25619]">Event</p>
              <p className="text-sm font-semibold text-white">FOUNDERS CONNECT</p>
              <p className="text-xs text-white/60">📅 10 October 2026</p>
              <p className="text-xs text-white/60">⏰ 12:00 PM – 10:00 PM</p>
              <p className="text-xs text-white/60">📍 August Loft Water Falls</p>
            </div>

            {/* Col 3: Support */}
            <div className="space-y-2">
              <p className="text-xs uppercase font-bold tracking-widest text-[#D9931E]">Contact</p>
              <p className="text-xs text-white/80 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E25619]" />
                <a href="tel:0979333751" className="hover:underline">0979333751</a>
              </p>
              <p className="text-xs text-white/80 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D9931E]" />
                <a href="mailto:connect@leapnetworks.org" className="hover:underline">connect@leapnetworks.org</a>
              </p>
              <p className="text-xs text-white/60 pt-1">
                Payments secured via Lipila Gateway.
              </p>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
            <p>© 2026 LEAP Networks. All rights reserved.</p>
            <p className="flex items-center space-x-1">
              <span>Built for LEAP Networks Founders Connect</span>
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
