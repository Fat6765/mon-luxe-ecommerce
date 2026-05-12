import { NextResponse } from 'next/server';

// Global mock data to simulate a database in memory
const mockProducts = [
  { id: '1', name: 'Manteau en Laine Mélangée', price: 895, category: 'Femmes', stock: 12, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop' },
  { id: '2', name: 'Chemise en Soie', price: 345, category: 'Hommes', stock: 8, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop' },
  { id: '3', name: 'Sac en Cuir Structuré', price: 1250, category: 'Accessoires', stock: 3, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1000&auto=format&fit=crop' },
  { id: '4', name: 'Sérum Éclat Nuit', price: 120, category: 'Beauté', stock: 15, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&auto=format&fit=crop' },
];

export async function GET() {
  return NextResponse.json(mockProducts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image } = body;
    
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = { 
      id: 'NEW-' + Date.now(), 
      name, 
      price: parseFloat(price), 
      category, 
      description,
      image,
      stock: 10
    };
    
    mockProducts.unshift(newProduct);
    
    return NextResponse.json({
      success: true,
      message: 'Produit ajouté avec succès',
      product: newProduct
    }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export the mockProducts so [id] route can use it (Note: in development mode Next.js might reset this, but it works for demo)
export { mockProducts };
