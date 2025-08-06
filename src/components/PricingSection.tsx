import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Student',
    price: '$79',
    period: '/week',
    description: '3 meals a day',
    icon: Zap,
    color: 'text-primary',
    badge: 'Budget-friendly',
    features: [
      'Budget-friendly pricing',
      'Customize for exam seasons', 
      'Pause anytime',
      'Basic meal customization',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$109', 
    period: '/week',
    description: '3 balanced meals',
    icon: Star,
    color: 'text-secondary',
    badge: 'Most Popular',
    features: [
      'Flexible delivery slots',
      'Custom calorie targets',
      'Special dietary preferences',
      'Advanced meal customization',
      'Priority support',
      'Nutrition coaching access',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$149',
    period: '/week', 
    description: 'Unlimited customization',
    icon: Crown,
    color: 'text-primary-glow',
    badge: 'All Features',
    features: [
      'Everything in Professional',
      'Personal nutrition coach',
      '24/7 meal adjustments',
      'Premium ingredients',
      'Same-day delivery',
      'Supplement recommendations',
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-accent/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pricing & <span className="gradient-text">Subscription</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, flexible plans to fit your schedule and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-8 text-center hover-glow transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-primary shadow-card scale-105 bg-gradient-to-b from-card to-accent/5' 
                  : 'border shadow-soft'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                  {plan.badge}
                </Badge>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <plan.icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-left">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? "hero" : "cta"}
                  size="lg" 
                  className="w-full mt-8"
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            All plans include free delivery • Cancel anytime • No hidden fees
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✅ 30-day money back guarantee</span>
            <span>✅ Pause or modify anytime</span>
            <span>✅ Personal nutrition support</span>
          </div>
        </div>
      </div>
    </section>
  );
};