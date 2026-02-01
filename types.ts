export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  options?: {
    isComposed?: boolean;
    requiredSelections?: number;
    availableChoices?: Array<{
      id: string;
      name: string;
      category: string;
    }>;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  openingHours: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  options?: {
    selectedChoices?: Array<{
      id: string;
      name: string;
    }>;
  };
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  orderType: 'delivery' | 'takeaway';
  instructions?: string;
}
