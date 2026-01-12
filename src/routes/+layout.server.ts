import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const userId = cookies.get('user_id');

  if (!userId) {
    return {
      user: null,
      theme: {
        accentColor: '#ff6b9d',
        backgroundColor: '#1a1a2e',
        cardColor: '#16213e',
        textColor: '#e5e5e5'
      }
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      settings: {
        select: {
          accentColor: true,
          backgroundColor: true,
          cardColor: true,
          textColor: true
        }
      }
    }
  });

  const theme = user?.settings || {
    accentColor: '#ff6b9d',
    backgroundColor: '#1a1a2e',
    cardColor: '#16213e',
    textColor: '#e5e5e5'
  };

  return { user, theme };
};
