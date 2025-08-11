import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { MealsSection } from '@/components/MealsSection';
import { PricingSection } from '@/components/PricingSection';
import { ContactSection } from '@/components/ContactSection';
import { ChatWidget } from '@/components/ChatWidget';
import { Scene3D } from '@/components/Scene3D';
import { ErrorBoundary } from '@/components/ErrorBoundary';
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary fallback={null}>
        <Scene3D />
      </ErrorBoundary>
      <Header />
      
      <main>
        <HeroSection />
        
        <section id="features">
          <FeaturesSection />
        </section>
        
        <section id="meals">
          <MealsSection />
        </section>
        
        <section id="pricing">
          <PricingSection />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      <ChatWidget />
      
      <footer className="py-12 bg-accent/20 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Fit Meals. Revolutionizing nutrition with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;