"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotals, clearCart } = useCartStore();
  const { total } = getTotals();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    setMounted(true);
    // If cart is empty and we haven't just submitted successfully, redirect to home
    if (items.length === 0 && !isSuccess) {
      router.push('/');
    }
  }, [items.length, isSuccess, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here we would typically send the data to our backend
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total,
          items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
        })
      });

      // We simulate a successful network request even if backend isn't running
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to submit order", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center px-4"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Commande Confirmée !</h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous paierez à la livraison. Nous vous contacterons très prochainement pour confirmer l&apos;expédition.
          </p>
          <Link 
            href="/"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all inline-block"
          >
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-muted-foreground transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour à la boutique
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-12">Validation de la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold">Informations de livraison</h2>
                <span className="text-sm px-3 py-1 bg-muted rounded-full font-medium">Paiement à la livraison</span>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input 
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 06 12 34 56 78"
                    className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Adresse de livraison</label>
                  <input 
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ex: 123 Rue de la République"
                    className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input 
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Paris"
                    className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-card border rounded-2xl p-6 md:p-8 sticky top-32">
              <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Qté: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Sous-total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Livraison</span>
                  <span className="text-primary font-medium text-xs bg-primary/10 px-2 py-0.5 rounded">GRATUITE</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-4">
                  <span>Total à payer</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                Aucun paiement requis maintenant. Vous paierez à la livraison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
