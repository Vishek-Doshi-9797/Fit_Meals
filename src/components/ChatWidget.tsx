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
      text: "Hey there! 👋 I'm your FitMeals AI buddy, and I'm genuinely excited to help you on your wellness journey! Whether you're curious about our amazing protein shakes, wholesome sandwiches, or energizing power bowls, I'm here to chat about nutrition, fitness goals, or anything that helps you feel your best! What's on your mind today? 😊",
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
      return "Oh, you've got great taste! 😍 Our Power Protein Shake is absolutely perfect for fueling your body—it's this amazing green smoothie packed with 35g of protein, fresh spinach, banana, and berries for just ₹299! Whether you're gearing up for a workout or recovering after, this little powerhouse will have you feeling energized and strong 💪 Want me to help you get one ordered?";
    } else if (input.includes('sandwich') || input.includes('chicken') || input.includes('bread')) {
      return "You're going to love our Fit Chicken Sandwich! 🥪✨ Picture this: perfectly grilled chicken with creamy avocado on hearty whole grain bread, giving you a whopping 38g of protein for ₹399. It's like a warm hug for your muscles and taste buds! Perfect for when you want something satisfying that actually helps you reach your fitness goals. Should we get one headed your way?";
    } else if (input.includes('bowl') || input.includes('acai') || input.includes('berry')) {
      return "Ooh, the Acai Power Bowl is one of my absolute favorites! 🍓💜 It's like eating a beautiful purple rainbow—antioxidant-rich acai topped with crunchy granola, fresh berries, and 25g of protein for ₹449. Your body will thank you for all those recovery nutrients, plus it tastes like dessert but fuels you like a champion! Ready to treat yourself to something this amazing?";
    } else if (input.includes('price') || input.includes('cost') || input.includes('order')) {
      return "I love that you're investing in your health! 🎯 Here's what we've got: Power Protein Shake ₹299, Fit Chicken Sandwich ₹399, and Acai Power Bowl ₹449. Every single one is made fresh just for you and delivered within 24 hours—it's like having a personal chef who actually cares about your wellness goals! Which one is calling your name? 😊";
    } else if (input.includes('contact') || input.includes('phone') || input.includes('call')) {
      return "We'd love to chat with you personally! 📞 You can reach our friendly team at +91 9327795254 or drop us an email at vishekdoshi162@gmail.com. We're here Mon-Sat from 9 AM to 8 PM, ready to help make your fitness journey a little easier and a lot more delicious! What can I help you with right now? 💬";
    } else if (input.includes('delivery') || input.includes('time') || input.includes('when')) {
      return "Here's the exciting part—we deliver fresh Fit Meals across India within 24 hours! 🚚💨 Everything is prepared fresh daily because you deserve the best fuel for your body. For the exact delivery time in your area, just give us a quick call at 9327795254. We'll make sure your healthy goodness gets to you right when you need it! 📍";
    } else if (input.includes('goal') || input.includes('weight') || input.includes('fitness') || input.includes('muscle')) {
      return "I love that you're focused on your goals! 🎯💪 Whether you're looking to build muscle, lose weight, or just feel more energized, our meals are designed to support exactly what you're working toward. Tell me a bit more about what you're aiming for, and I can suggest the perfect fuel to help you crush those goals! What's your main focus right now? 🌟";
    } else if (input.includes('healthy') || input.includes('nutrition') || input.includes('diet')) {
      return "You're speaking my language—I'm all about that healthy lifestyle! 🥗✨ Our meals aren't just delicious, they're thoughtfully crafted to give your body exactly what it needs. Real ingredients, balanced nutrition, and flavors that make eating well feel like a treat, not a chore. What aspect of healthy eating are you most curious about? I'm here to help! 💚";
    } else {
      return "Hey, wonderful human! 🌟 I'm so glad you're here! Whether you're curious about our protein-packed Power Shakes (₹299), satisfying Fit Chicken Sandwiches (₹399), or energizing Acai Power Bowls (₹449), I'm here to help you find exactly what your body needs to feel amazing. What's got you thinking about healthy eating today? Let's chat! 😊💪";
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