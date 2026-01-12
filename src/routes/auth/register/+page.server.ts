import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString()?.trim();
    const email = formData.get('email')?.toString()?.trim().toLowerCase();
    const displayName = formData.get('displayName')?.toString()?.trim() || null;
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();
    const acceptTerms = formData.get('acceptTerms') === 'on';

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return fail(400, {
        message: 'All required fields must be filled'
      });
    }

    if (!acceptTerms) {
      return fail(400, {
        message: 'You must accept the Terms of Service and Privacy Policy'
      });
    }

    // Username validation
    if (username.length < 3 || username.length > 20) {
      return fail(400, {
        message: 'Username must be between 3 and 20 characters'
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return fail(400, {
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, {
        message: 'Please provide a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return fail(400, {
        message: 'Password must be at least 6 characters long'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        message: 'Passwords do not match'
      });
    }

    try {
      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return fail(409, {
            message: 'Email is already registered'
          });
        }
        if (existingUser.username === username) {
          return fail(409, {
            message: 'Username is already taken'
          });
        }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          displayName,
          passwordHash,
          isOnline: true
        }
      });

      // Set session cookie
      cookies.set('user_id', user.id, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 1 day
      });

    } catch (error) {
      console.error('Registration error:', error);
      return fail(500, {
        message: 'An error occurred during registration'
      });
    }

    throw redirect(303, '/');
  }
} satisfies Actions;
