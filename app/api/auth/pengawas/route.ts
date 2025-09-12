// app/api/auth/pengawas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Query user dengan role pengawas dari tabel users
    const { data: user, error } = await supabase.from('users').select('*').eq('username', username).eq('role', 'pengawas').single();

    console.log('Query result:', { user: user ? { id: user.id, username: user.username, role: user.role } : null, error });

    if (error || !user) {
      console.log('Pengawas auth error:', error?.message || 'User not found');
      console.log('Searching for username:', username, 'with role: pengawas');
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password dengan bcrypt
    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Pengawas password invalid for user:', username);
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Pengawas auth server error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
