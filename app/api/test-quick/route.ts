// app/api/test-quick/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test tabel users
    console.log('Testing users table...');
    const { data: users, error: usersError } = await supabase.from('users').select('id, username, role, name, is_shared_account, created_at');

    if (usersError) {
      return NextResponse.json({
        status: 'error',
        message: 'Users table error',
        error: usersError.message,
      });
    }

    // Group by role
    const usersByRole = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    return NextResponse.json({
      status: 'success',
      message: 'Database connected successfully!',
      data: {
        total_users: users.length,
        users_by_role: {
          driver: usersByRole.driver?.length || 0,
          admin: usersByRole.admin?.length || 0,
          pengawas: usersByRole.pengawas?.length || 0,
        },
        sample_users: users.map((u) => ({
          username: u.username,
          role: u.role,
          name: u.name,
        })),
        connection: 'OK',
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Connection failed',
      error: error.message,
    });
  }
}
