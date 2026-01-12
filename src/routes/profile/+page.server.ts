import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = cookies.get('user_id');

  if (!userId) {
    throw redirect(303, '/auth/login');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        bio: true,
        isOnline: true,
        createdAt: true
      }
    });

    if (!user) {
      cookies.delete('user_id', { path: '/' });
      throw redirect(303, '/auth/login');
    }

    // TODO: Add game statistics when game models are implemented
    const stats = {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      rank: 'Unranked'
    };

    return {
      user,
      stats
    };
  } catch (error) {
    console.error('Profile load error:', error);
    throw redirect(303, '/auth/login');
  }
};
