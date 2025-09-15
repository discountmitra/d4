export type MenuItem = {
  item: string;
  price: number | { half: number; full: number };
};

export type MenuCategory = {
  [key: string]: MenuItem[];
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  specialist: string[];
  menu: MenuCategory | MenuItem[] | any;
  discounts: {
    normal_users: string;
    vip_users: string;
  };
  actions: {
    book_table: string;
    takeaway?: boolean;
  };
  offers: {
    cashback: string;
    payment: string;
  };
  photos: string[];
  rating: number;
  reviews: number;
  distance: string;
  prepTime: string;
  phone: string;
  openTime: string;
  area: string;
  priceForTwo: string;
  opensIn: string;
  savePercent?: number;
};

export const restaurantData: Restaurant[] = [
  {
    id: "1",
    name: "ICE HOUSE",
    category: "Food",
    specialist: ["Pizza", "Burger", "Ice Creams", "French Fries", "Mocktails", "Thickshakes"],
    menu: {
      "pizzas": [
        { "item": "Peri Peri Paneer Pizza", "price": 200 },
        { "item": "Corn Pizza", "price": 180 },
        { "item": "Garden Veg Pizza", "price": 170 },
        { "item": "Chicken Tikka Pizza", "price": 200 },
        { "item": "Chicken Delight Pizza", "price": 210 },
        { "item": "Corn & Chicken Pizza", "price": 230 }
      ],
      "milkshakes": [
        { "item": "Vanilla Milkshake", "price": 130 },
        { "item": "Butterscotch Milkshake", "price": 140 },
        { "item": "Strawberry Milkshake", "price": 140 },
        { "item": "Chocolate Milkshake", "price": 140 },
        { "item": "Mango Milkshake", "price": 140 },
        { "item": "Dry Fruit Milkshake", "price": 140 },
        { "item": "Oreo Milkshake", "price": 140 },
        { "item": "Blackcurrant Milkshake", "price": 150 },
        { "item": "Banana Milkshake", "price": 150 },
        { "item": "Kitkat Milkshake", "price": 150 }
      ],
      "thickshakes": [
        { "item": "Vanilla Thickshake", "price": 170 },
        { "item": "Butterscotch Thickshake", "price": 180 },
        { "item": "Strawberry Thickshake", "price": 180 },
        { "item": "Chocolate Thickshake", "price": 180 },
        { "item": "Mango Thickshake", "price": 180 },
        { "item": "Dry Fruit Thickshake", "price": 200 },
        { "item": "Oreo Thickshake", "price": 180 },
        { "item": "Blackcurrant Thickshake", "price": 180 },
        { "item": "Banana Thickshake", "price": 180 },
        { "item": "Kitkat Thickshake", "price": 190 }
      ],
      "desserts": [
        { "item": "Nuts Over Load Ice Cream", "price": 190 },
        { "item": "Dry Fruit Delight Ice Cream", "price": 200 },
        { "item": "Fruit Exotica Ice Cream", "price": 200 },
        { "item": "Oreo Shot Ice Cream", "price": 190 },
        { "item": "Nutella Brownie Ice Cream", "price": 220 }
      ],
      "mocktails": [
        { "item": "Virgin Mojito", "price": 160 },
        { "item": "Fruit Punch", "price": 160 },
        { "item": "Blue Lagoon", "price": 160 },
        { "item": "Thunder Thums Up", "price": 160 }
      ],
      "wraps": [
        { "item": "Con Salsa Wrap", "price": 150 },
        { "item": "Paneer Wrap", "price": 180 },
        { "item": "Mix Veg Wrap", "price": 140 },
        { "item": "Veg Jumbo Wrap", "price": 200 },
        { "item": "Chicken Tikka Wrap", "price": 190 },
        { "item": "Corn & Chicken Wrap", "price": 210 }
      ],
      "snacks": [
        { "item": "Crispy & Spicy Chicken Strips", "price": 196 },
        { "item": "Crispy & Spicy Chicken Popcorn (15P)", "price": 196 },
        { "item": "French Fries", "price": 120 }
      ],
      "burgers_sandwiches": [
        { "item": "Mix Veg Burger", "price": 140 },
        { "item": "Paneer Burger", "price": 160 },
        { "item": "Chilli Chicken Burger", "price": 170 }
      ]
    },
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: {
      book_table: "Book Now",
      takeaway: true
    },
    offers: {
      cashback: "Up to 7% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/icehouse.jpg"],
    rating: 4.5,
    reviews: 250,
    distance: "6km",
    prepTime: "25-30 mins",
    phone: "+91 98765 43210",
    openTime: "10:00 AM - 11:00 PM",
    area: "Gandi Maisa...",
    priceForTwo: "₹300 for two",
    opensIn: "Open Now",
    savePercent: 20,
  },
  {
    id: "2",
    name: "Shankar Chat",
    category: "Food",
    specialist: ["Pani Puri", "Chaat"],
    menu: [
      { "item": "Pani Puri", "price": 10 },
      { "item": "Dhahi Puri", "price": 25 },
      { "item": "Chaat", "price": 30 }
    ],
    discounts: {
      normal_users: "10% Discount",
      vip_users: "15% Discount"
    },
    actions: { 
      book_table: "Book Now",
      takeaway: true
    },
    offers: {
      cashback: "Up to 10% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/shankarchat.jpg"],
    rating: 4.8,
    reviews: 180,
    distance: "9km",
    prepTime: "17 mins",
    phone: "+91 98765 43211",
    openTime: "11:00 AM - 10:00 PM",
    area: "Kompally",
    priceForTwo: "₹700 for two",
    opensIn: "Opens in 17 mins",
    savePercent: 66,
  },
  {
    id: "3",
    name: "Indian Fast Food",
    category: "Food",
    specialist: ["Rice", "Noodles", "Manchurian (Veg, Non-Veg & Egg)"],
    menu: {
      "rice": [
        { "item": "Veg Fried Rice", "price": { "half": 70, "full": 110 } },
        { "item": "Egg Fried Rice", "price": { "half": 70, "full": 110 } },
        { "item": "Chicken Fried Rice", "price": { "half": 80, "full": 120 } },
        { "item": "SPL Chicken Rice", "price": { "half": 90, "full": 140 } }
      ],
      "noodles": [
        { "item": "Veg Noodles", "price": { "half": 70, "full": 110 } },
        { "item": "Egg Noodles", "price": { "half": 70, "full": 110 } },
        { "item": "Chicken Noodles", "price": { "half": 80, "full": 120 } },
        { "item": "SPL Chicken Noodles", "price": { "half": 90, "full": 150 } }
      ],
      "manchurian": [
        { "item": "Veg Manchurian", "price": { "half": 80, "full": 120 } },
        { "item": "Chicken Manchurian", "price": 150 },
        { "item": "Lollipop", "price": 45 }
      ]
    },
    discounts: {
      normal_users: "5% Discount",
      vip_users: "10% Discount"
    },
    actions: { 
      book_table: "Book Now",
      takeaway: true
    },
    offers: {
      cashback: "Up to 10% cashback",
      payment: "Online Payment"
    },
    photos: ["supabase_bucket_url/food/indianfastfood.jpg"],
    rating: 4.6,
    reviews: 320,
    distance: "9km",
    prepTime: "17 mins",
    phone: "+91 98765 43212",
    openTime: "12:00 PM - 11:00 PM",
    area: "Pet Basheera...",
    priceForTwo: "₹500 for two",
    opensIn: "Opens in 17 mins",
    savePercent: 56,
  },
];


