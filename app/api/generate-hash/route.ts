// app/api/generate-hash/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password is required',
        },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    return NextResponse.json({
      success: true,
      data: {
        plain_password: password,
        hashed_password: hashedPassword,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error generating hash',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
