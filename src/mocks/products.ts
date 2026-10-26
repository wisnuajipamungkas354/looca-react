import { Product } from "@/types"

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Polca-Looca Scraft Hat",
    category_id: 1, // Fashion
    images: ["/mock/fashion2.jpeg", "/mock/fashion3.jpeg"],
    description: "2 in 1 scraft and hat that avail for 2 size small and medium.",
    action_link: "https://id.shp.ee/AUnMoub8",
    action_label: "Shop Now",
    total_click: 142,
  },
  {
    id: 2,
    name: "Custom Attire",
    category_id: 1, // Fashion
    images: ["/mock/fashion1.jpeg", "/mock/fashion.jpeg"],
    description: "Custom-made kebaya, family outfits, bridesmaid dresses, and more. Tailored to your design, measurements, and style.",
    action_link: "https://www.instagram.com/looca_tailor",
    action_label: "Request Custom",
    total_click: 98,
  },
  {
    id: 3,
    name: "Initial Bracelet",
    category_id: 2, // Accessories
    images: ["/mock/about1.jpeg", "/mock/about2.jpeg"],
    description: "Stainless steel bracelet, locally handmade by skilled crafters. Durable, timeless, and made to last.",
    action_link: "https://id.shp.ee/HYVGmweV",
    action_label: "Shop Now",
    total_click: 265,
  },
  {
    id: 4,
    name: "Orchid Bagcharm",
    category_id: 3, // Bagcharm
    images: ["/mock/about3.jpeg"],
    description: "Handmade orchid charm with delicate bead details",
    action_link: "https://id.shp.ee/Egy3nwWV",
    action_label: "Shop Now",
    total_click: 184,
  },
  {
    id: 5,
    name: "2 in 1 Tasbeeh bracelet",
    category_id: 2, // Accessories
    images: ["/mock/about4.jpeg", "/mock/about6.jpeg"],
    description: "A versatile bracelet & tasbih in one with pastel tone acrylic beads.",
    action_link: "https://id.shp.ee/yndBxeAL",
    action_label: "Shop Now",
    total_click: 112,
  },
  {
    id: 6,
    name: "K-pop bracelet – Haechan",
    category_id: 2, // Accessories
    images: ["/mock/acc-kpop-bracelet.jpg"],
    description: "Haechan-inspired bracelet with 2 designs: Bear & Sunflower.",
    action_link: "https://id.shp.ee/D5oPDkBV",
    action_label: "Shop Now",
    total_click: 310,
  },
  {
    id: 7,
    name: "Coorporate/Brand Merch",
    category_id: 5, // Merchandise
    images: ["/mock/souvenir-institution-brand.jpeg", "/mock/souvenir-institution-brand-2.png"],
    description: "Custom designs with adjustable budget & quantity. Available products: keychains, stickers, mirrors, pouches, and more.",
    action_link: "https://wa.me/6281215312939",
    action_label: "Inquire Bulk Order",
    total_click: 154,
  },
  {
    id: 8,
    name: "Wedding Souvenir",
    category_id: 4, // Souvenir
    images: ["/mock/souvenir-wedding.jpeg", "/mock/souvenir-wedding-2.jpeg"],
    description: "Custom-made souvenirs with personalized initials and cute packaging.",
    action_link: "https://wa.me/6281215312939",
    action_label: "Inquire Bulk Order",
    total_click: 220,
  },
  {
    id: 9,
    name: "Concert & Fan Merch Edition",
    category_id: 5, // Merchandise
    images: ["/mock/merch-concert.jpeg", "/mock/merch-concert-2.jpeg"],
    description: "Custom concert freebies, lightstick straps, and fan gathering merchandise.",
    action_link: "https://wa.me/6281215312939",
    action_label: "Inquire Bulk Order",
    total_click: 288,
  },
]
