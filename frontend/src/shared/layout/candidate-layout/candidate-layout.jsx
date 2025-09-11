import React from "react";
import Header from "@/shared/layout/candidate-layout/Header";
import Footer from "@/shared/layout/candidate-layout/Footer";
import ChatWootWidget from "@/shared/components/ui/chatwoot-widget";

export default function CandidateLayout({ children }) {
  return (
    <div data-scope="candidate" className="flex flex-col min-h-screen overflow-x-hidden app-shell candidate">
      {/* Header is fixed positioned, doesn't take up flow space */}
      <Header />
      
      {/* Main content with top padding to account for fixed header */}
      <main className="flex-1 pt-20 mt-4 transition-all duration-300 sm:pt-16">
        {children}
      </main>
      
      {/* Footer stays at bottom */}
      <ChatWootWidget />

      <Footer />
      
    </div>
  );
}
