// app/api/auth/driver/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Query user dengan role driver dari tabel users
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('role', 'driver')
      .single();

    if (error || !user) {
      console.log('Driver auth error:', error?.message || 'User not found');
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password dengan bcrypt
    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Driver password invalid for user:', username, 'Hash:', (user.password || '').toString().substring(0, 20) + '...');
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        nik: user.nik,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Driver auth server error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
