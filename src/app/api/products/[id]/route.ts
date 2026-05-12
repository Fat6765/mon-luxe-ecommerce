import { NextResponse } from 'next/server';
import { mockProducts } from '../route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === params.id);
  if (product) {
    return NextResponse.json(product);
  }
  return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = mockProducts.findIndex(p => p.id === params.id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
  }
  return NextResponse.json({ success: true, message: 'Produit supprimé avec succès' });
}
