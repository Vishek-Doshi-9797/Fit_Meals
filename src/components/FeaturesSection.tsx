import { Card } from '@/components/ui/card';
import { Brain, Utensils, Truck, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Step 1: Tell Your Goals',
    description: 'Choose bulking, cutting, or maintaining, set calorie targets if you want.',
    color: 'text-primary',
  },
  {
    icon: Utensils,
    title: 'Step 2: AI Meal Match',
    description: 'We personalize breakfast, lunch & dinner using the latest nutrition science.',
    color: 'text-secondary',
  },
  {
    icon: Truck,
    title: 'Step 3: Meals Delivered',
    description: 'Get chef-cooked meals delivered—fresh, macro-perfect, no prep needed.',
    color: 'text-primary-glow',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            How Our <span className="gradient-text">AI Customizes</span> Meals
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Answer a few questions on fitness goal, style & diet preferences. Our smart AI crafts a plan—protein-rich, 
            balanced macros, ready-to-eat meals, delivered fresh. Adjust anytime with real results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 text-center hover-glow border-0 shadow-card bg-gradient-to-b from-card to-accent/5"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Meals Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Goal Achievement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">24h</div>
            <div className="text-sm text-muted-foreground">Fresh Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
};