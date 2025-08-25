import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJson, getApiBaseUrl } from '@/lib/api';

export const Header = () => {
  const { data } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => fetchJson<{ status: string }>(`${getApiBaseUrl()}/health`),
    staleTime: 60_000,
  });
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Fit Meals</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#meals" className="text-foreground hover:text-primary transition-colors">Sample Meals</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              API: {data?.status === 'ok' ? 'online' : 'checking...'}
            </div>
            <Button variant="hero" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};