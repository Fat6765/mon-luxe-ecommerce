import { NextResponse } from 'next/server';

let mockOrders = [
  {
    id: '1',
    customerName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    total: 895,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerName: 'Marie Curie',
    email: 'marie@example.com',
    total: 345,
    status: 'PAID',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export async function GET() {
  return NextResponse.json(mockOrders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, fullName, phone, address, city, totalAmount } = body;

    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 10000),
      customerName: fullName,
      phone,
      address,
      city,
      total: totalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    mockOrders.unshift(newOrder);

    return NextResponse.json({ 
      success: true, 
      message: 'Commande reçue avec succès',
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
