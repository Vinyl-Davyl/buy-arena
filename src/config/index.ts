export const PRODUCT_CATEGORIES = [
  {
    label: "Buys",
    value: "buys" as const,
    featured: [
      {
        name: "Editor Picks",
        href: "/products?category=buys",
        imageSrc: "/nav/buy/picks.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=buys&sort=desc",
        imageSrc: "/nav/buy/new.jpg",
      },
      {
        name: "Best Buys",
        href: "/products?category=buys",
        imageSrc: "/nav/buy/bestbuys.jpg",
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
        imageSrc: "/nav/rent/favorite.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=rents&sort=desc",
        imageSrc: "/nav/rent/newarrivals.jpg",
      },
      {
        name: "Best Rated Rents",
        href: "/products?category=rents",
        imageSrc: "/nav/rent/bestrated.jpg",
      },
    ],
  },
];
