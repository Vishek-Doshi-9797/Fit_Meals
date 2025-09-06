import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CartProps {
  children: React.ReactNode;
}

export const Cart = ({ children }: CartProps) => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({
    delivery_address: '',
    phone: '',
    special_instructions: '',
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrderForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (state.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some meals to your cart first.",
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.delivery_address || !orderForm.phone) {
      toast({
        title: "Missing information",
        description: "Please provide delivery address and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderItems = state.items.map(item => ({
        meal_id: item.id,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          items: orderItems,
          delivery_address: orderForm.delivery_address,
          phone: orderForm.phone,
          special_instructions: orderForm.special_instructions,
        },
      });

      if (error) throw error;

      toast({
        title: "Order placed successfully! 🎉",
        description: `Your order #${data.order_id} has been placed. We'll contact you soon with delivery details.`,
      });

      // Clear cart and form
      clearCart();
      setOrderForm({
        delivery_address: '',
        phone: '',
        special_instructions: '',
      });
      setIsOpen(false);

    } catch (error: any) {
      toast({
        title: "Failed to place order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({state.itemCount} items)
          </SheetTitle>
          <SheetDescription>
            Review your items and place your order
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some delicious meals to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(0)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Order Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{state.total.toFixed(0)}</span>
                </div>
              </div>

              <Separator />

              {/* Order Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery_address">Delivery Address *</Label>
                  <Textarea
                    id="delivery_address"
                    name="delivery_address"
                    placeholder="Enter your complete delivery address"
                    value={orderForm.delivery_address}
                    onChange={handleFormChange}
                    required
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={orderForm.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="special_instructions"
                    name="special_instructions"
                    placeholder="Any special requests or dietary preferences..."
                    value={orderForm.special_instructions}
                    onChange={handleFormChange}
                    className="min-h-16"
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${state.total.toFixed(0)}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our terms and conditions. 
                We'll contact you within 30 minutes to confirm your order.
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};