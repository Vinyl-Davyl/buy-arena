"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
  isFeatured?: boolean; 
}

const FALLBACK_LIMIT = 4;

const shuffleArray = (array: Product[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query, isFeatured } = props;

  // Use the appropriate query based on the isFeatured prop
  const { data: queryResults, isLoading } = isFeatured
    ? trpc.getFeaturedProducts.useQuery({ limit: query.limit ?? FALLBACK_LIMIT })
    : trpc.getInfiniteProducts.useInfiniteQuery(
        {
          limit: query.limit ?? FALLBACK_LIMIT,
          query,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextPage,
        }
      );

    // console.log("queryResults:", queryResults);
    // console.log("isLoading:", isLoading);
  const products = isFeatured 
    ? queryResults 
    : Array.isArray(queryResults) 
      ? queryResults 
      : queryResults?.pages.flatMap((page) => page.items) || [];

  // console.log("products:", products);
    
  let map: (Product | null)[] = [];
  if (Array.isArray(products) && products.length > 0) {
    map = shuffleArray(products as unknown as Product[]);
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing key={`product-${i}`} product={product} index={i} />
            ))}
          </div>
        </div>

        {href && (
          <div className="mt-4 flex justify-end md:hidden"> {/* Only show on mobile */}
            <Link
              href={href}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Shop the collection <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReel;