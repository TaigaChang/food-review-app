export interface CategoryScores {
  taste: number
  ambiance: number
  service: number
  price: number
}

export interface Review {
  id: string
  author: string
  avatar: string
  scores: CategoryScores
  rating: number
  date: string
  text: string
}

export interface RatingHistoryPoint {
  label: string
  rating: number
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  neighborhood: string
  priceRange: string
  rating: number
  reviewCount: number
  image: string
  description: string
  address: string
  hours: string
  phone: string
  tags: string[]
  reviews: Review[]
  categoryAverages: CategoryScores
  ratingHistory: {
    fiveYear: RatingHistoryPoint[]
    oneYear: RatingHistoryPoint[]
    oneMonth: RatingHistoryPoint[]
  }
}

export function computeWeightedScore(scores: CategoryScores): number {
  const weighted = scores.taste * 0.6 + scores.ambiance * 0.15 + scores.service * 0.15 + scores.price * 0.1
  return Math.round(weighted * 10) / 10
}

export const CATEGORY_WEIGHTS = {
  taste: 0.6,
  ambiance: 0.15,
  service: 0.15,
  price: 0.1,
}

export const CATEGORY_LABELS: Record<keyof CategoryScores, string> = {
  taste: "Taste",
  ambiance: "Ambiance",
  service: "Service",
  price: "Price",
}

export const restaurants: Restaurant[] = [
  {
    id: "katsura",
    name: "Katsura",
    cuisine: "Japanese",
    neighborhood: "Downtown",
    priceRange: "$$$",
    rating: 4.8,
    reviewCount: 324,
    image: "/images/restaurant-1.jpg",
    description:
      "An intimate omakase experience where Chef Tanaka curates a nightly menu of pristine seafood flown in from Tsukiji Market. The minimalist space seats just 12, ensuring every guest receives undivided attention.",
    address: "142 W 4th Street, Downtown",
    hours: "Tue-Sat 6:00 PM - 10:00 PM",
    phone: "(555) 234-5678",
    tags: ["Omakase", "Sushi", "Fine Dining"],
    categoryAverages: { taste: 4.9, ambiance: 4.7, service: 4.8, price: 4.2 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 4.2 },
        { label: "2022", rating: 4.5 },
        { label: "2023", rating: 4.6 },
        { label: "2024", rating: 4.7 },
        { label: "2025", rating: 4.8 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.6 },
        { label: "Apr", rating: 4.5 },
        { label: "May", rating: 4.7 },
        { label: "Jun", rating: 4.6 },
        { label: "Jul", rating: 4.8 },
        { label: "Aug", rating: 4.7 },
        { label: "Sep", rating: 4.8 },
        { label: "Oct", rating: 4.7 },
        { label: "Nov", rating: 4.9 },
        { label: "Dec", rating: 4.8 },
        { label: "Jan", rating: 4.8 },
        { label: "Feb", rating: 4.8 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.7 },
        { label: "Week 2", rating: 4.9 },
        { label: "Week 3", rating: 4.8 },
        { label: "Week 4", rating: 4.8 },
      ],
    },
    reviews: [
      {
        id: "r1",
        author: "Elena M.",
        avatar: "E",
        scores: { taste: 5.0, ambiance: 4.8, service: 5.0, price: 4.0 },
        rating: 4.9,
        date: "Feb 12, 2026",
        text: "Transcendent. The uni was unlike anything I've ever tasted, and the A5 wagyu course left me speechless. Chef Tanaka is a true artist.",
      },
      {
        id: "r2",
        author: "James K.",
        avatar: "J",
        scores: { taste: 5.0, ambiance: 4.5, service: 4.8, price: 4.3 },
        rating: 4.8,
        date: "Jan 28, 2026",
        text: "Worth every penny. The progression of flavors across the 18-course omakase told a story. The sake pairings were perfectly matched.",
      },
      {
        id: "r3",
        author: "Sofia R.",
        avatar: "S",
        scores: { taste: 4.8, ambiance: 3.8, service: 4.5, price: 4.0 },
        rating: 4.6,
        date: "Jan 15, 2026",
        text: "Exquisite fish, impeccable presentation. The only reason for the lower ambiance score is the cramped seating. But the food is undeniably world-class.",
      },
    ],
  },
  {
    id: "nonna-lucia",
    name: "Nonna Lucia",
    cuisine: "Italian",
    neighborhood: "Little Italy",
    priceRange: "$$",
    rating: 4.6,
    reviewCount: 512,
    image: "/images/restaurant-2.jpg",
    description:
      "Three generations of the Bianchi family have poured their hearts into this trattoria. Every pasta is hand-rolled daily, and the Sunday ragu simmers for eight hours using Nonna's original recipe from Napoli.",
    address: "88 Mulberry Street, Little Italy",
    hours: "Mon-Sun 11:30 AM - 10:30 PM",
    phone: "(555) 345-6789",
    tags: ["Pasta", "Traditional", "Family-Style"],
    categoryAverages: { taste: 4.7, ambiance: 4.5, service: 4.4, price: 4.6 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 4.3 },
        { label: "2022", rating: 4.4 },
        { label: "2023", rating: 4.5 },
        { label: "2024", rating: 4.5 },
        { label: "2025", rating: 4.6 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.4 },
        { label: "Apr", rating: 4.5 },
        { label: "May", rating: 4.4 },
        { label: "Jun", rating: 4.5 },
        { label: "Jul", rating: 4.6 },
        { label: "Aug", rating: 4.5 },
        { label: "Sep", rating: 4.6 },
        { label: "Oct", rating: 4.5 },
        { label: "Nov", rating: 4.6 },
        { label: "Dec", rating: 4.7 },
        { label: "Jan", rating: 4.6 },
        { label: "Feb", rating: 4.6 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.5 },
        { label: "Week 2", rating: 4.6 },
        { label: "Week 3", rating: 4.7 },
        { label: "Week 4", rating: 4.6 },
      ],
    },
    reviews: [
      {
        id: "r4",
        author: "Marco P.",
        avatar: "M",
        scores: { taste: 5.0, ambiance: 4.6, service: 4.5, price: 4.8 },
        rating: 4.9,
        date: "Feb 8, 2026",
        text: "The cacio e pepe transported me straight to Rome. Simple, perfect, soulful. This is what Italian cooking should be.",
      },
      {
        id: "r5",
        author: "Ava L.",
        avatar: "A",
        scores: { taste: 4.5, ambiance: 4.3, service: 4.2, price: 4.5 },
        rating: 4.4,
        date: "Jan 20, 2026",
        text: "Wonderful atmosphere and the pappardelle with wild boar ragu was divine. Gets crowded on weekends, so book ahead.",
      },
    ],
  },
  {
    id: "basil-and-thyme",
    name: "Basil & Thyme",
    cuisine: "Thai",
    neighborhood: "Midtown",
    priceRange: "$$",
    rating: 4.5,
    reviewCount: 287,
    image: "/images/restaurant-3.jpg",
    description:
      "Chef Siriporn brings the vibrant flavors of Bangkok street food to an elegant setting. Expect bold curries, perfectly balanced som tum, and the city's best pad krapow.",
    address: "225 E 53rd Street, Midtown",
    hours: "Mon-Sun 12:00 PM - 10:00 PM",
    phone: "(555) 456-7890",
    tags: ["Curry", "Street Food", "Modern Thai"],
    categoryAverages: { taste: 4.6, ambiance: 4.3, service: 4.4, price: 4.5 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 4.1 },
        { label: "2022", rating: 4.2 },
        { label: "2023", rating: 4.3 },
        { label: "2024", rating: 4.4 },
        { label: "2025", rating: 4.5 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.3 },
        { label: "Apr", rating: 4.2 },
        { label: "May", rating: 4.4 },
        { label: "Jun", rating: 4.3 },
        { label: "Jul", rating: 4.5 },
        { label: "Aug", rating: 4.4 },
        { label: "Sep", rating: 4.5 },
        { label: "Oct", rating: 4.4 },
        { label: "Nov", rating: 4.5 },
        { label: "Dec", rating: 4.6 },
        { label: "Jan", rating: 4.5 },
        { label: "Feb", rating: 4.5 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.4 },
        { label: "Week 2", rating: 4.5 },
        { label: "Week 3", rating: 4.6 },
        { label: "Week 4", rating: 4.5 },
      ],
    },
    reviews: [
      {
        id: "r6",
        author: "Daniel W.",
        avatar: "D",
        scores: { taste: 5.0, ambiance: 4.5, service: 4.6, price: 4.7 },
        rating: 4.9,
        date: "Feb 1, 2026",
        text: "The green curry here has ruined all other green curries for me. Perfectly spiced with incredible depth. The mango sticky rice is a must.",
      },
      {
        id: "r7",
        author: "Nina T.",
        avatar: "N",
        scores: { taste: 4.3, ambiance: 4.2, service: 4.1, price: 4.3 },
        rating: 4.3,
        date: "Jan 10, 2026",
        text: "Beautifully plated Thai food with serious flavor. The larb was punchy and fresh. Great cocktail menu too.",
      },
    ],
  },
  {
    id: "le-petit-bistro",
    name: "Le Petit Bistro",
    cuisine: "French",
    neighborhood: "West Village",
    priceRange: "$$$",
    rating: 4.7,
    reviewCount: 198,
    image: "/images/restaurant-4.jpg",
    description:
      "A slice of Paris tucked into a West Village corner. The zinc bar, the hand-written menu, the steak frites that dreams are made of. Wine list curated from small French vineyards.",
    address: "31 Commerce Street, West Village",
    hours: "Tue-Sun 5:30 PM - 11:00 PM",
    phone: "(555) 567-8901",
    tags: ["Bistro", "Wine Bar", "Classic French"],
    categoryAverages: { taste: 4.8, ambiance: 4.9, service: 4.6, price: 3.8 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 4.4 },
        { label: "2022", rating: 4.5 },
        { label: "2023", rating: 4.6 },
        { label: "2024", rating: 4.6 },
        { label: "2025", rating: 4.7 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.5 },
        { label: "Apr", rating: 4.6 },
        { label: "May", rating: 4.5 },
        { label: "Jun", rating: 4.7 },
        { label: "Jul", rating: 4.6 },
        { label: "Aug", rating: 4.7 },
        { label: "Sep", rating: 4.6 },
        { label: "Oct", rating: 4.7 },
        { label: "Nov", rating: 4.8 },
        { label: "Dec", rating: 4.7 },
        { label: "Jan", rating: 4.7 },
        { label: "Feb", rating: 4.7 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.6 },
        { label: "Week 2", rating: 4.7 },
        { label: "Week 3", rating: 4.8 },
        { label: "Week 4", rating: 4.7 },
      ],
    },
    reviews: [
      {
        id: "r8",
        author: "Claire B.",
        avatar: "C",
        scores: { taste: 4.9, ambiance: 5.0, service: 4.7, price: 3.5 },
        rating: 4.8,
        date: "Feb 10, 2026",
        text: "The duck confit was crispy perfection and the creme brulee is the best in the city. The ambiance makes you forget you're not in Montmartre.",
      },
    ],
  },
  {
    id: "casa-oaxaca",
    name: "Casa Oaxaca",
    cuisine: "Mexican",
    neighborhood: "East Village",
    priceRange: "$$",
    rating: 4.4,
    reviewCount: 445,
    image: "/images/restaurant-5.jpg",
    description:
      "Regional Mexican cuisine celebrating the rich mole tradition of Oaxaca. Seven types of mole made from scratch, plus fresh-pressed tortillas, mezcal flights, and a salsa bar that'll make you weep.",
    address: "56 Avenue B, East Village",
    hours: "Mon-Sun 11:00 AM - 11:00 PM",
    phone: "(555) 678-9012",
    tags: ["Mole", "Mezcal", "Regional Mexican"],
    categoryAverages: { taste: 4.5, ambiance: 4.2, service: 4.1, price: 4.7 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 4.0 },
        { label: "2022", rating: 4.1 },
        { label: "2023", rating: 4.2 },
        { label: "2024", rating: 4.3 },
        { label: "2025", rating: 4.4 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.2 },
        { label: "Apr", rating: 4.1 },
        { label: "May", rating: 4.3 },
        { label: "Jun", rating: 4.2 },
        { label: "Jul", rating: 4.4 },
        { label: "Aug", rating: 4.3 },
        { label: "Sep", rating: 4.4 },
        { label: "Oct", rating: 4.3 },
        { label: "Nov", rating: 4.4 },
        { label: "Dec", rating: 4.5 },
        { label: "Jan", rating: 4.4 },
        { label: "Feb", rating: 4.4 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.3 },
        { label: "Week 2", rating: 4.4 },
        { label: "Week 3", rating: 4.5 },
        { label: "Week 4", rating: 4.4 },
      ],
    },
    reviews: [
      {
        id: "r9",
        author: "Luis G.",
        avatar: "L",
        scores: { taste: 4.8, ambiance: 4.3, service: 4.2, price: 4.9 },
        rating: 4.7,
        date: "Feb 5, 2026",
        text: "Finally, authentic Oaxacan mole negro in the city. The complexity of flavors took me right back to my abuela's kitchen. The mezcal selection is outstanding.",
      },
      {
        id: "r10",
        author: "Rachel H.",
        avatar: "R",
        scores: { taste: 4.3, ambiance: 4.0, service: 4.0, price: 4.5 },
        rating: 4.2,
        date: "Jan 22, 2026",
        text: "The tacos al pastor were incredible and the salsa verde had just the right kick. Lively atmosphere, great for groups.",
      },
    ],
  },
  {
    id: "seoul-fire",
    name: "Seoul Fire",
    cuisine: "Korean",
    neighborhood: "Koreatown",
    priceRange: "$$",
    rating: 4.3,
    reviewCount: 378,
    image: "/images/restaurant-6.jpg",
    description:
      "Premium Korean BBQ with a modern twist. Tableside grilling of prime cuts, an extensive banchan spread, and a kimchi jjigae that's been perfected over 20 years.",
    address: "320 W 32nd Street, Koreatown",
    hours: "Mon-Sun 11:30 AM - 12:00 AM",
    phone: "(555) 789-0123",
    tags: ["BBQ", "Banchan", "Modern Korean"],
    categoryAverages: { taste: 4.4, ambiance: 4.1, service: 4.2, price: 4.3 },
    ratingHistory: {
      fiveYear: [
        { label: "2021", rating: 3.9 },
        { label: "2022", rating: 4.0 },
        { label: "2023", rating: 4.1 },
        { label: "2024", rating: 4.2 },
        { label: "2025", rating: 4.3 },
      ],
      oneYear: [
        { label: "Mar", rating: 4.1 },
        { label: "Apr", rating: 4.0 },
        { label: "May", rating: 4.2 },
        { label: "Jun", rating: 4.1 },
        { label: "Jul", rating: 4.3 },
        { label: "Aug", rating: 4.2 },
        { label: "Sep", rating: 4.3 },
        { label: "Oct", rating: 4.2 },
        { label: "Nov", rating: 4.3 },
        { label: "Dec", rating: 4.4 },
        { label: "Jan", rating: 4.3 },
        { label: "Feb", rating: 4.3 },
      ],
      oneMonth: [
        { label: "Week 1", rating: 4.2 },
        { label: "Week 2", rating: 4.3 },
        { label: "Week 3", rating: 4.4 },
        { label: "Week 4", rating: 4.3 },
      ],
    },
    reviews: [
      {
        id: "r11",
        author: "Chris K.",
        avatar: "C",
        scores: { taste: 4.7, ambiance: 4.2, service: 4.5, price: 4.4 },
        rating: 4.6,
        date: "Feb 14, 2026",
        text: "The galbi is melt-in-your-mouth perfection and the banchan spread here is the most generous in K-town. Come hungry.",
      },
      {
        id: "r12",
        author: "Yuki S.",
        avatar: "Y",
        scores: { taste: 4.2, ambiance: 4.0, service: 4.0, price: 4.2 },
        rating: 4.1,
        date: "Jan 30, 2026",
        text: "Great quality meat and the staff is incredibly attentive with the grilling. The soju cocktails are a nice modern touch.",
      },
    ],
  },
]

export const cuisineTypes = [
  "All",
  "Japanese",
  "Italian",
  "Thai",
  "French",
  "Mexican",
  "Korean",
]
