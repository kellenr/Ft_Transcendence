import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const identifier = formData.get('identifier')?.toString();
    const password = formData.get('password')?.toString();
    const remember = formData.get('remember') === 'on';

    if (!identifier || !password) {
      return fail(400, {
        message: 'Email/username and password are required'
      });
    }

    try {
      // Find user by email or username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { username: identifier }
          ]
        }
      });

      if (!user) {
        return fail(401, {
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return fail(401, {
          message: 'Invalid credentials'
        });
      }

      // TODO: Implement proper session management
      // For now, just set a simple cookie
      cookies.set('user_id', user.id, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
      });

      // Update user's online status
      await prisma.user.update({
        where: { id: user.id },
        data: { isOnline: true }
      });

    } catch (error) {
      console.error('Login error:', error);
      return fail(500, {
        message: 'An error occurred during login'
      });
    }

    throw redirect(303, '/');
  }
} satisfies Actions;
