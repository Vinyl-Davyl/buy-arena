export const PRODUCT_CATEGORIES = [
  {
    label: "Buys",
    value: "buys" as const,
    featured: [
      {
        name: "Editor Picks",
        href: "/products?category=buys",
        imageSrc: "/nav/buy/mixed.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=buys&sort=desc",
        imageSrc: "/nav/buy/blue.jpg",
      },
      {
        name: "Best Buys",
        href: "/products?category=buys",
        imageSrc: "/nav/buy/purple.jpg",
      },
    ],
  },
  {
    label: "Rents",
    value: "rents" as const,
    featured: [
      {
        name: "Favorite Rent Picks",
        href: "/products?category=rents",
        imageSrc: "/nav/rent/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=rents&sort=desc",
        imageSrc: "/nav/rent/new.jpg",
      },
      {
        name: "Best Rated Rents",
        href: "/products?category=rents",
        imageSrc: "/nav/rent/bestsellers.jpg",
      },
    ],
  },
];
