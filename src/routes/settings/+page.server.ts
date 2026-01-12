import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = cookies.get('user_id');

  if (!userId) {
    throw redirect(303, '/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      settings: true
    }
  });

  if (!user) {
    cookies.delete('user_id', { path: '/' });
    throw redirect(303, '/auth/login');
  }

  // Create default settings if they don't exist
  let settings = user.settings;
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId: user.id
      }
    });
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName
    },
    settings
  };
};

export const actions = {
  changePassword: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const currentPassword = formData.get('currentPassword')?.toString();
    const newPassword = formData.get('newPassword')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return fail(400, { message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { message: 'New passwords do not match' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true }
      });

      if (!user) {
        throw redirect(303, '/auth/login');
      }

      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validPassword) {
        return fail(401, { message: 'Current password is incorrect' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash }
      });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      return fail(500, { message: 'Failed to change password' });
    }
  },

  changeEmail: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const newEmail = formData.get('newEmail')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();

    if (!newEmail || !password) {
      return fail(400, { message: 'Email and password are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return fail(400, { message: 'Please provide a valid email address' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true, email: true }
      });

      if (!user) {
        throw redirect(303, '/auth/login');
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return fail(401, { message: 'Password is incorrect' });
      }

      if (user.email === newEmail) {
        return fail(400, { message: 'New email is the same as current email' });
      }

      // Check if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email: newEmail }
      });

      if (existingUser) {
        return fail(409, { message: 'Email is already in use' });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { email: newEmail }
      });

      return { success: true, message: 'Email changed successfully' };
    } catch (error) {
      console.error('Email change error:', error);
      return fail(500, { message: 'Failed to change email' });
    }
  },

  updatePreferences: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const soundEnabled = formData.get('soundEnabled') === 'on';
    const musicVolume = parseInt(formData.get('musicVolume')?.toString() || '50', 10);
    const sfxVolume = parseInt(formData.get('sfxVolume')?.toString() || '50', 10);

    try {
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          soundEnabled,
          musicVolume: Math.max(0, Math.min(100, musicVolume)),
          sfxVolume: Math.max(0, Math.min(100, sfxVolume))
        },
        create: {
          userId,
          soundEnabled,
          musicVolume: Math.max(0, Math.min(100, musicVolume)),
          sfxVolume: Math.max(0, Math.min(100, sfxVolume))
        }
      });

      return { success: true, message: 'Preferences saved' };
    } catch (error) {
      console.error('Preferences update error:', error);
      return fail(500, { message: 'Failed to save preferences' });
    }
  },

  updatePrivacy: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const showOnlineStatus = formData.get('showOnlineStatus') === 'on';
    const showMatchHistory = formData.get('showMatchHistory') === 'on';
    const allowFriendRequests = formData.get('allowFriendRequests') === 'on';

    try {
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          showOnlineStatus,
          showMatchHistory,
          allowFriendRequests
        },
        create: {
          userId,
          showOnlineStatus,
          showMatchHistory,
          allowFriendRequests
        }
      });

      return { success: true, message: 'Privacy settings saved' };
    } catch (error) {
      console.error('Privacy update error:', error);
      return fail(500, { message: 'Failed to save privacy settings' });
    }
  },

  updateTheme: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const accentColor = formData.get('accentColor')?.toString() || '#ff6b9d';
    const backgroundColor = formData.get('backgroundColor')?.toString() || '#1a1a2e';
    const cardColor = formData.get('cardColor')?.toString() || '#16213e';
    const textColor = formData.get('textColor')?.toString() || '#e5e5e5';

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(accentColor) ||
        !hexColorRegex.test(backgroundColor) ||
        !hexColorRegex.test(cardColor) ||
        !hexColorRegex.test(textColor)) {
      return fail(400, { message: 'Invalid color format. Use hex colors like #ff6b9d' });
    }

    try {
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          accentColor,
          backgroundColor,
          cardColor,
          textColor
        },
        create: {
          userId,
          accentColor,
          backgroundColor,
          cardColor,
          textColor
        }
      });

      return { success: true, message: 'Theme colors updated' };
    } catch (error) {
      console.error('Theme update error:', error);
      return fail(500, { message: 'Failed to update theme' });
    }
  },

  updateNotifications: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const emailNotifications = formData.get('emailNotifications') === 'on';
    const gameInviteNotifications = formData.get('gameInviteNotifications') === 'on';

    try {
      await prisma.userSettings.upsert({
        where: { userId },
        update: {
          emailNotifications,
          gameInviteNotifications
        },
        create: {
          userId,
          emailNotifications,
          gameInviteNotifications
        }
      });

      return { success: true, message: 'Notification settings saved' };
    } catch (error) {
      console.error('Notifications update error:', error);
      return fail(500, { message: 'Failed to save notification settings' });
    }
  },

  deleteAccount: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const password = formData.get('password')?.toString();
    const confirmation = formData.get('confirmation')?.toString();

    if (!password) {
      return fail(400, { message: 'Password is required to delete account' });
    }

    if (confirmation !== 'DELETE') {
      return fail(400, { message: 'Please type DELETE to confirm' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true }
      });

      if (!user) {
        throw redirect(303, '/auth/login');
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return fail(401, { message: 'Password is incorrect' });
      }

      // Delete user (UserSettings will cascade delete)
      await prisma.user.delete({
        where: { id: userId }
      });

      // Clear session
      cookies.delete('user_id', { path: '/' });

      throw redirect(303, '/?deleted=true');
    } catch (error) {
      if (error instanceof Response) throw error;
      console.error('Account deletion error:', error);
      return fail(500, { message: 'Failed to delete account' });
    }
  }
} satisfies Actions;
