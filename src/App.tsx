/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CompanyProfileSection } from './components/CompanyProfileSection';
import { ServicesSection } from './components/ServicesSection';
import { PdaCalculatorSection } from './components/PdaCalculatorSection';
import { PortDirectoryAndMap } from './components/PortDirectoryAndMap';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactFormSection } from './components/ContactFormSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { COMPANY_CONTACT } from './data/companyData';
import { MessageSquare } from 'lucide-react';

function MainApp() {
  const { lang } = useLanguage();
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<string>('Shipping Agency & Port Clearance');
  const [estimateSummaryForForm, setEstimateSummaryForForm] = useState<string>('');

  const scrollToContact = () => {
    const el = document.getElementById('kontak');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForForm(serviceTitle);
    scrollToContact();
  };

  const handleApplyEstimate = (data: {
    vesselType: string;
    grossTonnage: number;
    portStayDays: number;
    terminal: string;
    services: string[];
    estimatedSummary: string;
  }) => {
    setSelectedServiceForForm('Shipping Agency & Port Clearance');
    setEstimateSummaryForForm(data.estimatedSummary);
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Navigation Top Bar */}
      <Navbar onOpenContact={scrollToContact} />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onOpenContact={scrollToContact} />

        {/* Company Profile (Balikpapan & Leadership) */}
        <CompanyProfileSection />

        {/* Core Maritime & Logistics Services */}
        <ServicesSection onSelectServiceForInquiry={handleSelectService} />

        {/* Interactive Port Disbursement Account (PDA) Calculator */}
        <PdaCalculatorSection onApplyEstimateToForm={handleApplyEstimate} />

        {/* Balikpapan Port Terminals Directory & Google Maps Integration */}
        <PortDirectoryAndMap />

        {/* Client Testimonials */}
        <TestimonialsSection />

        {/* Professional Contact Form */}
        <ContactFormSection
          initialService={selectedServiceForForm}
          prefilledEstimate={estimateSummaryForForm}
        />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onOpenContact={scrollToContact} />

      {/* Floating 24/7 Operations WhatsApp Dispatch Button */}
      <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
        <a
          href={COMPANY_CONTACT.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:scale-105"
          title={`WhatsApp: ${COMPANY_CONTACT.directorName} (+6282229357500)`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">
            {lang === 'en' ? '24/7 Ops: ' : 'Ops 24 Jam: '}{COMPANY_CONTACT.directorName}
          </span>
          <span className="sm:hidden whitespace-nowrap">WhatsApp</span>
        </a>
      </aside>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
