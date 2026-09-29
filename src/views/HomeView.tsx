import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { PillarsSection } from '../components/PillarsSection';
import { CatalogVitrine } from '../components/CatalogVitrine';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { HumanCuratedSection } from '../components/HumanCuratedSection';
import { SocialShowcaseSection } from '../components/SocialShowcaseSection';

export const HomeView: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <CatalogVitrine />
      <HowItWorksSection />
      <SocialShowcaseSection />
      <HumanCuratedSection />
    </main>
  );
};
