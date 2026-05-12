"use client";

import { useState, useEffect, Suspense } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image: string;
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          const filtered = data.filter((p: Product) => 
            p.name.toLowerCase().includes(lowerQuery) || 
            (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
            p.category.toLowerCase().includes(lowerQuery)
          );
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {query ? `Résultats pour "${query}"` : "Tous les produits"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {query 
            ? `Découvrez les pièces correspondant à votre recherche.`
            : `Découvrez notre collection complète. L'élégance et la qualité réunies dans chaque pièce.`}
        </p>
        {query && (
          <Link href="/shop" className="inline-block mt-4 text-sm font-medium border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            Effacer la recherche
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border">
           <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
           <p className="text-muted-foreground mb-6">Nous n&apos;avons trouvé aucun résultat pour &quot;{query}&quot;.</p>
           <Link href="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all">
            Voir tous les produits
           </Link>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ShopAllPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <Suspense fallback={<div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
