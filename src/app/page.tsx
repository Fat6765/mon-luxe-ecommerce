"use client";

import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Hero />
      
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Nouveautés</h2>
            <p className="text-muted-foreground">Les dernières pièces ajoutées à notre collection.</p>
          </div>
          <Link href="/shop" className="text-sm font-medium uppercase tracking-wider border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            Voir tout
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucun produit à afficher.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary py-24 mt-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Rejoignez le Club</h2>
          <p className="text-muted-foreground mb-8">
            Inscrivez-vous pour recevoir nos mises à jour et nos offres exclusives.
          </p>
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Entrez votre email" 
              className="flex-1 bg-background border-none px-6 py-4 rounded-full focus:ring-2 focus:ring-primary outline-none"
            />
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all">
              S'inscrire
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
