// API configuration and service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  dietaryPreferences?: string[];
  fitnessGoals?: 'bulking' | 'cutting' | 'maintenance';
  allergies?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Meal types
export interface Meal {
  _id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake';
  type: 'meal' | 'shake' | 'sandwich';
  nutritionFacts: NutritionFacts;
  ingredients: string[];
  allergens: string[];
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  dietaryTags: string[];
  preparationTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Order types
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  deliveryDate: string;
  deliveryTime: string;
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  mealId: string | Meal;
  quantity: number;
  price: number;
  customizations?: string[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API utility functions
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }
  
  return data;
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const result = await handleApiResponse<ApiResponse<AuthResponse>>(response);
    return result.data!;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    const result = await handleApiResponse<ApiResponse<AuthResponse>>(response);
    return result.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<User>>(response);
    return result.data!;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<{ token: string }>>(response);
    return result.data!;
  },
};

// Meals API
export const mealsApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    dietaryTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  } = {}): Promise<PaginatedResponse<Meal>> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/meals?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<PaginatedResponse<Meal>>(response);
  },

  getById: async (id: string): Promise<Meal> => {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<Meal>>(response);
    return result.data!;
  },

  getFeatured: async (): Promise<Meal[]> => {
    const response = await fetch(`${API_BASE_URL}/meals/featured`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<Meal[]>>(response);
    return result.data!;
  },

  getByCategory: async (category: string): Promise<Meal[]> => {
    const response = await fetch(`${API_BASE_URL}/meals/category/${category}`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<Meal[]>>(response);
    return result.data!;
  },
};

// Orders API
export const ordersApi = {
  create: async (orderData: {
    items: { mealId: string; quantity: number; customizations?: string[] }[];
    deliveryAddress: Address;
    deliveryDate: string;
    deliveryTime: string;
    notes?: string;
  }): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await handleApiResponse<ApiResponse<Order>>(response);
    return result.data!;
  },

  getMyOrders: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<PaginatedResponse<Order>>(response);
  },

  getById: async (id: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<Order>>(response);
    return result.data!;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<Order>>(response);
    return result.data!;
  },
};

// Payment API
export const paymentsApi = {
  createIntent: async (orderId: string): Promise<{ clientSecret: string; paymentId: string }> => {
    const response = await fetch(`${API_BASE_URL}/payments/create-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId }),
    });
    
    const result = await handleApiResponse<ApiResponse<{ clientSecret: string; paymentId: string }>>(response);
    return result.data!;
  },

  confirm: async (paymentIntentId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    });
    
    const result = await handleApiResponse<ApiResponse<any>>(response);
    return result.data!;
  },

  getHistory: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/history`, {
      headers: getAuthHeaders(),
    });
    
    const result = await handleApiResponse<ApiResponse<any[]>>(response);
    return result.data!;
  },
};