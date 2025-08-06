import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Fit Meals AI assistant. I can help you with our protein shakes, healthy sandwiches, and power bowls. I can also answer questions about nutrition and our services. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('shake') || input.includes('protein') || input.includes('smoothie')) {
      return "Our Power Protein Shake is perfect for you! It's a green smoothie with 35g protein, spinach, banana, and berries for ₹299. Great for pre/post workout nutrition. Would you like to order one?";
    } else if (input.includes('sandwich') || input.includes('chicken') || input.includes('bread')) {
      return "Try our Fit Chicken Sandwich! Grilled chicken with avocado on whole grain bread, packed with 38g protein for ₹399. Perfect for muscle building. Can I help you place an order?";
    } else if (input.includes('bowl') || input.includes('acai') || input.includes('berry')) {
      return "Our Acai Power Bowl is amazing for recovery! Antioxidant-rich acai with granola, berries, and 25g protein for ₹449. Great post-workout nutrition. Interested in ordering?";
    } else if (input.includes('price') || input.includes('cost') || input.includes('order')) {
      return "Our Fit Meals prices: Power Protein Shake ₹299, Fit Chicken Sandwich ₹399, Acai Power Bowl ₹449. All freshly prepared and delivered within 24 hours. Which one would you like to try?";
    } else if (input.includes('contact') || input.includes('phone') || input.includes('call')) {
      return "You can reach us at +91 9327795254 or email vishekdoshi162@gmail.com. We're available Mon-Sat: 9:00 AM - 8:00 PM. How can I assist you with your order?";
    } else if (input.includes('delivery') || input.includes('time') || input.includes('when')) {
      return "We deliver fresh Fit Meals across India within 24 hours! Orders are prepared fresh daily. For specific delivery times in your area, call us at 9327795254.";
    } else {
      return "Welcome to Fit Meals! We offer protein shakes (₹299), healthy sandwiches (₹399), and power bowls (₹449) - all designed for your fitness goals. What would you like to know more about?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="floating-action w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] flex flex-col glass-effect shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Fit Meals Assistant</span>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble ${message.isUser ? 'user' : 'bot'}`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-bubble bot">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-background/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about meal plans, nutrition..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                variant="cta"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};