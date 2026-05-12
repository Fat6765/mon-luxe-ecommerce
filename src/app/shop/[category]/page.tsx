"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { motion } from 'framer-motion';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize category name for display
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  
  // Mapping URL slugs to exact database category names
  const categoryMap: Record<string, string> = {
    'femmes': 'Femmes',
    'hommes': 'Hommes',
    'accessoires': 'Accessoires',
    'beaute': 'Beauté'
  };

  const dbCategoryName = categoryMap[params.category.toLowerCase()] || categoryName;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Filter by the specific category requested
        const filtered = data.filter((p: any) => p.category === dbCategoryName);
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dbCategoryName]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{dbCategoryName}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Découvrez notre sélection exclusive de la collection {dbCategoryName.toLowerCase()}.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border">
            <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">Nous n'avons pas encore de produits dans la catégorie {dbCategoryName}.</p>
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
    </div>
  );
}
