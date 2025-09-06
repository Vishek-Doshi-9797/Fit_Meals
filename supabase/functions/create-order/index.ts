import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  meal_id: string;
  quantity: number;
}

interface OrderRequest {
  items: OrderItem[];
  delivery_address: string;
  phone: string;
  special_instructions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderRequest: OrderRequest = await req.json();

    // Validate request
    if (!orderRequest.items || orderRequest.items.length === 0) {
      return new Response(JSON.stringify({ error: "No items in order" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get meal prices and calculate total
    const mealIds = orderRequest.items.map(item => item.meal_id);
    const { data: meals, error: mealsError } = await supabaseClient
      .from('meals')
      .select('id, price, name')
      .in('id', mealIds);

    if (mealsError) {
      throw new Error(`Failed to fetch meals: ${mealsError.message}`);
    }

    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of orderRequest.items) {
      const meal = meals?.find(m => m.id === item.meal_id);
      if (!meal) {
        return new Response(JSON.stringify({ error: `Meal not found: ${item.meal_id}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const itemTotal = meal.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        meal_id: item.meal_id,
        quantity: item.quantity,
        price: meal.price,
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        delivery_address: orderRequest.delivery_address,
        phone: orderRequest.phone,
        special_instructions: orderRequest.special_instructions,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log(`Order created successfully: ${order.id} for user ${user.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      order_id: order.id,
      total_amount: totalAmount 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});