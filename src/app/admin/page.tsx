"use client";

import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">Bienvenue sur votre espace d'administration Luxe.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Ventes Totales</p>
              <h3 className="text-2xl font-bold">$12,450.00</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-emerald-500 mt-4 font-medium">+15% ce mois-ci</p>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Commandes</p>
              <h3 className="text-2xl font-bold">142</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-emerald-500 mt-4 font-medium">+8% ce mois-ci</p>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Produits</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-medium">4 en rupture de stock</p>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Clients</p>
              <h3 className="text-2xl font-bold">89</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-emerald-500 mt-4 font-medium">+12 nouveaux</p>
        </div>
      </div>

      {/* Placeholder for charts/recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 h-80 flex items-center justify-center text-muted-foreground">
          Graphique des ventes (À venir)
        </div>
        <div className="bg-card border rounded-xl p-6 h-80 flex items-center justify-center text-muted-foreground">
          Activité récente (À venir)
        </div>
      </div>
    </div>
  );
}
