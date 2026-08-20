import { mockApi } from "./apiClient";

const collections = [
  {
    id: "dresses",
    slug: "dresses",
    name: "Dresses",
    tagline: "Draped, tailored, made in Europe",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "hair",
    slug: "hair",
    name: "Hair",
    tagline: "Ethically sourced, 100% Remy",
    image: "https://images.unsplash.com/photo-1596215143922-eedece089622?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    tagline: "Leather goods made to age well",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop",
  },
];

export function getCollections() {
  return mockApi(() => collections.map((c) => ({ ...c })));
}

export function getCollection(idOrSlug) {
  return mockApi(() => collections.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null);
}