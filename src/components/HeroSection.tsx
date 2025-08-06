import { Button } from '@/components/ui/button';
import { Sparkles, Target, Zap } from 'lucide-react';
import breakfastHero from '@/assets/breakfast-hero.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg opacity-10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-glow/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Unlock Your{' '}
                <span className="gradient-text">Best Self</span>{' '}
                with AI Meal Plans
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Personalized, healthy gym-focused meals, delivered and tailored to your fitness goals. 
                Hit bulking, cutting or maintenance targets—effortlessly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="px-8 py-6 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Customize Your Meal Plan
              </Button>
              <Button variant="glass" size="lg" className="px-8 py-6 text-lg">
                <Target className="mr-2 h-5 w-5" />
                View Sample Meals
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start pt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>AI-Powered Nutrition</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4 text-primary" />
                <span>Goal-Specific Plans</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Fresh Daily Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl hover-glow">
              <img
                src={breakfastHero}
                alt="AI-optimized healthy breakfast bowl"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-semibold shadow-lg z-20">
              🔥 2800+ calories
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-lg z-20">
              💪 45g protein
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};