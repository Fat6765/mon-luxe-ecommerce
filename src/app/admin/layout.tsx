"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Settings, Store, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If we are on the login page, don't check for auth to avoid redirect loops
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Check for token
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  // While checking auth state, show nothing or a loader
  if (isChecking) return <div className="min-h-screen bg-muted/30 flex items-center justify-center">Chargement...</div>;

  // If on login page, just render the login component without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If authenticated and not on login page, render full admin dashboard
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b">
          <span className="font-bold tracking-widest uppercase text-xl">Luxe Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/orders' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <ShoppingCart className="w-5 h-5" />
            Commandes
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/products' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Package className="w-5 h-5" />
            Produits
          </Link>
        </nav>
        
        <div className="p-4 border-t space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Store className="w-5 h-5" />
            Voir la boutique
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-24 md:pt-8 px-4 md:px-8 pb-12">
        {children}
      </main>
    </div>
  );
}
