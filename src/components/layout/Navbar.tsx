"use client";

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { getTotals, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products for live search when overlay opens
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setAllProducts(data))
        .catch(err => console.error(err));
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const { count } = getTotals();

  // Compute live search results
  const searchResults = searchQuery.trim() 
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4) // Show up to 4 live results
    : [];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu */}
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase">
            Luxe
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/shop" className="hover:text-muted-foreground transition-colors font-semibold">Boutique</Link>
            <Link href="/shop/femmes" className="hover:text-muted-foreground transition-colors">Femmes</Link>
            <Link href="/shop/hommes" className="hover:text-muted-foreground transition-colors">Hommes</Link>
            <Link href="/shop/accessoires" className="hover:text-muted-foreground transition-colors">Accessoires</Link>
            <Link href="/shop/beaute" className="hover:text-muted-foreground transition-colors">Beauté</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/admin" className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block" title="Tableau de Bord Admin">
              <User className="w-5 h-5" />
            </Link>
            <button onClick={toggleCart} className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {mounted && count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Search Fullscreen Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-start pt-32 px-4 overflow-y-auto"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearchSubmit}
              className="w-full max-w-4xl relative"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground" />
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-transparent border-b-2 border-foreground/20 text-3xl md:text-5xl py-6 pl-20 pr-6 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
              />
              
              {!searchQuery && (
                <p className="text-muted-foreground text-center mt-6">
                  Commencez à écrire pour voir les résultats en direct.
                </p>
              )}
            </motion.form>

            {/* Live Search Results */}
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl mt-12 mb-20"
              >
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" onClick={() => setIsSearchOpen(false)}>
                    {searchResults.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    Aucun produit trouvé pour "{searchQuery}".
                  </div>
                )}
                
                {searchResults.length > 0 && (
                  <div className="text-center mt-12">
                    <button 
                      onClick={handleSearchSubmit}
                      className="text-sm font-medium border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
                    >
                      Voir tous les résultats
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
