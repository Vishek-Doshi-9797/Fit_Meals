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
      text: "Hi! I'm your AI nutrition assistant. I can help you create personalized meal plans based on your fitness goals. What are you looking to achieve?",
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
    
    if (input.includes('bulk') || input.includes('gain') || input.includes('muscle')) {
      return "Great! For bulking, I recommend a high-calorie meal plan with 2800-3200 calories daily. Focus on lean proteins (150-200g), complex carbs, and healthy fats. Would you like me to create a 7-day bulking meal plan?";
    } else if (input.includes('cut') || input.includes('lose') || input.includes('fat')) {
      return "Perfect for cutting! I'll design a calorie-deficit plan around 1800-2200 calories with high protein (120-150g) to preserve muscle. Includes metabolism-boosting foods. Shall I generate your personalized cutting meal plan?";
    } else if (input.includes('maintain') || input.includes('maintenance')) {
      return "Maintenance is key for sustainable health! I'll create a balanced 2200-2600 calorie plan with optimal macros. Great for consistent energy and body composition. Ready to see your maintenance meal plan?";
    } else if (input.includes('vegetarian') || input.includes('vegan')) {
      return "Excellent! I specialize in plant-based nutrition for fitness goals. I'll ensure you get complete proteins from legumes, quinoa, and nuts. What's your primary goal - bulking, cutting, or maintenance?";
    } else if (input.includes('allergies') || input.includes('allergic')) {
      return "No problem! I can customize meals for any allergies or dietary restrictions. Common ones I handle: nuts, dairy, gluten, shellfish. Please tell me your specific allergies so I can create a safe, delicious plan.";
    } else {
      return "That's interesting! Based on your goals, I can create a personalized meal plan with exact portions, timing, and macro breakdowns. I also factor in your activity level and preferences. What's your main fitness goal right now?";
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
              <span className="font-semibold">AI Nutrition Assistant</span>
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