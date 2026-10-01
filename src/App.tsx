/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './components/Toast';
import { Header } from './components/Header';
import { BusTrackerView } from './components/BusTrackerView';
import { RouteExplorerView } from './components/RouteExplorerView';
import { SavedStopsView } from './components/SavedStopsView';
import { ServiceAlertsView } from './components/ServiceAlertsView';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('bus-tracker');
  const [selectedBus, setSelectedBus] = useState<string>('65');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'EN' | 'ZH'>('EN');

  const handleSelectServiceFromSearch = (serviceNo: string) => {
    setSelectedBus(serviceNo);
    setActiveTab('bus-tracker');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1c1b1b] antialiased">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          lang={lang}
          setLang={setLang}
        />

        {/* Main Content Area */}
        <main className="w-full pt-20 md:pt-24 flex-1 flex flex-col">
          {activeTab === 'bus-tracker' && (
            <BusTrackerView
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              lang={lang}
            />
          )}

          {activeTab === 'route-explorer' && (
            <RouteExplorerView
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              lang={lang}
            />
          )}

          {activeTab === 'saved-stops' && (
            <SavedStopsView
              onSelectBus={(bus) => setSelectedBus(bus)}
              onNavigateToTracker={() => setActiveTab('bus-tracker')}
              lang={lang}
            />
          )}

          {activeTab === 'service-alerts' && <ServiceAlertsView lang={lang} />}
        </main>

        {/* Global Footer */}
        <Footer lang={lang} />

        {/* Command Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectService={handleSelectServiceFromSearch}
          lang={lang}
        />
      </div>
    </ToastProvider>
  );
}
