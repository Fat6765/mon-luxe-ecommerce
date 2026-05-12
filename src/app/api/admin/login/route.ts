import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (email === 'admin@luxe.com' && password === 'admin123') {
      return NextResponse.json({ 
        success: true, 
        token: 'fake-admin-jwt-token-12345',
        message: 'Login successful' 
      }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Identifiants incorrects' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
