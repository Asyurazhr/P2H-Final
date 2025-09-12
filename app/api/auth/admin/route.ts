// app/api/auth/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Query user dengan role admin dari tabel users
    const { data: user, error } = await supabase.from('users').select('*').eq('username', username).eq('role', 'admin').single();

    if (error || !user) {
      console.log('Admin auth error:', error?.message || 'User not found');
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password dengan hash
    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Admin password invalid for user:', username);
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin auth server error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
