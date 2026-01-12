import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = 'static/uploads/avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

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
      displayName: true,
      avatar: true,
      bio: true
    }
  });

  if (!user) {
    cookies.delete('user_id', { path: '/' });
    throw redirect(303, '/auth/login');
  }

  return { user };
};

export const actions = {
  updateProfile: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const displayName = formData.get('displayName')?.toString().trim() || null;
    const bio = formData.get('bio')?.toString().trim() || null;

    // Validate display name
    if (displayName && displayName.length > 50) {
      return fail(400, {
        message: 'Display name must be 50 characters or less'
      });
    }

    // Validate bio
    if (bio && bio.length > 500) {
      return fail(400, {
        message: 'Bio must be 500 characters or less'
      });
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          displayName,
          bio
        }
      });

      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Profile update error:', error);
      return fail(500, {
        message: 'Failed to update profile. Please try again.'
      });
    }
  },

  uploadAvatar: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file || file.size === 0) {
      return fail(400, { message: 'No file selected' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return fail(400, {
        message: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.'
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return fail(400, {
        message: 'File too large. Maximum size is 5MB.'
      });
    }

    try {
      // Get current user to delete old avatar
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      // Ensure upload directory exists
      if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
      }

      // Generate unique filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${userId}-${Date.now()}.${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Save file
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(arrayBuffer));

      // Update database with new avatar URL
      const avatarUrl = `/uploads/avatars/${filename}`;
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarUrl }
      });

      // Delete old avatar if it exists and is a local file
      if (user?.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldPath = path.join('static', user.avatar);
        if (existsSync(oldPath)) {
          await unlink(oldPath).catch(() => {});
        }
      }

      return { success: true, message: 'Avatar updated successfully', avatar: avatarUrl };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return fail(500, {
        message: 'Failed to upload avatar. Please try again.'
      });
    }
  },

  removeAvatar: async ({ cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      // Delete old avatar file if it exists
      if (user?.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldPath = path.join('static', user.avatar);
        if (existsSync(oldPath)) {
          await unlink(oldPath).catch(() => {});
        }
      }

      // Clear avatar in database
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null }
      });

      return { success: true, message: 'Avatar removed' };
    } catch (error) {
      console.error('Avatar removal error:', error);
      return fail(500, {
        message: 'Failed to remove avatar. Please try again.'
      });
    }
  },

  selectPredefinedAvatar: async ({ request, cookies }) => {
    const userId = cookies.get('user_id');
    if (!userId) {
      throw redirect(303, '/auth/login');
    }

    const formData = await request.formData();
    const avatarPath = formData.get('avatarPath')?.toString();

    // Validate the avatar path is one of our predefined avatars
    const validAvatars = [
      '/avatars/robot.svg',
      '/avatars/alien.svg',
      '/avatars/astronaut.svg',
      '/avatars/ninja.svg',
      '/avatars/wizard.svg',
      '/avatars/ghost.svg',
      '/avatars/cat.svg',
      '/avatars/panda.svg'
    ];

    if (!avatarPath || !validAvatars.includes(avatarPath)) {
      return fail(400, { message: 'Invalid avatar selection' });
    }

    try {
      // Get current user to delete old custom avatar if exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      // Delete old custom avatar file if it exists
      if (user?.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldPath = path.join('static', user.avatar);
        if (existsSync(oldPath)) {
          await unlink(oldPath).catch(() => {});
        }
      }

      // Update database with predefined avatar
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarPath }
      });

      return { success: true, message: 'Avatar updated', avatar: avatarPath };
    } catch (error) {
      console.error('Avatar selection error:', error);
      return fail(500, {
        message: 'Failed to select avatar. Please try again.'
      });
    }
  }
} satisfies Actions;
