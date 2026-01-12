import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ cookies }) => {
  const userId = cookies.get('user_id');

  // Update user's online status
  if (userId) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      });
    } catch (error) {
      console.error('Error updating user status on logout:', error);
    }
  }

  // Clear the session cookie
  cookies.delete('user_id', { path: '/' });

  throw redirect(303, '/');
};
