"use client";

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Femmes',
    image: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', description: '', price: '', category: 'Vêtements', image: '' });
        setImagePreview(null);
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground mt-1">Ajoutez de nouveaux produits à votre boutique.</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b">
          <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <Plus className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold">Ajouter un produit</h2>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            Le produit a été ajouté avec succès et est visible sur le site !
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du produit</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: T-Shirt Premium Noir"
                className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix ($)</label>
              <input 
                required
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 45.99"
                className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
              >
                <option value="Femmes">Femmes</option>
                <option value="Hommes">Hommes</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Beauté">Beauté</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo du produit</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden relative flex-shrink-0">
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-background border px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez votre produit..."
              className="w-full bg-background border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer le produit"}
            </button>
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="mt-12 bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Produits existants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-muted-foreground text-sm border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Prix</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Aucun produit trouvé.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
