"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Share2, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: string[];
  image: string;
}

// In a real app, we would fetch this by ID. 
// We mock it here so the demo is fully functional.
const MOCK_PRODUCTS: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Cashmere Blend Overcoat',
    price: 895,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop',
    description: 'Elevate your winter wardrobe with our signature Cashmere Blend Overcoat. Tailored to perfection with a slightly oversized fit, notched lapels, and premium horn buttons.',
    details: ['80% Wool, 20% Cashmere', 'Fully lined', 'Dry clean only', 'Made in Italy'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Camel', 'Navy']
  }
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Camel');
  
  const { addItem } = useCartStore();

  // If no mock product, use a fallback layout for demo purposes.
  const product = MOCK_PRODUCTS[params.id] || MOCK_PRODUCTS['1'];

  const handleAddToCart = () => {
    addItem({
      ...product,
      size: selectedSize,
      color: selectedColor
    });
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span>Shop</span>
        <ChevronRight className="w-4 h-4" />
        <span>{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-[3/4] w-full bg-muted rounded-xl overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-muted-foreground">${product.price}</p>
          </div>

          <p className="text-foreground/80 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Color: {selectedColor}</h3>
            <div className="flex gap-3">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    selectedColor === color 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-border hover:border-foreground'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Size: {selectedSize}</h3>
              <button className="text-sm text-muted-foreground underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-md border text-sm font-medium transition-all ${
                    selectedSize === size 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-border hover:border-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </button>
            <button className="p-4 border border-border rounded-full hover:bg-muted transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-4 border border-border rounded-full hover:bg-muted transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Details Accordion */}
          <div className="border-t border-border pt-8">
            <h3 className="font-medium mb-4 uppercase tracking-wider text-sm">Product Details</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {product.details.map((detail: string, i: number) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
