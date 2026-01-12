import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({
    status: 'healthy',                    // Simple status
    timestamp: new Date().toISOString(), // When this check ran
    service: 'ft_transcendence',         // Which service this is
    version: '1.0.0'                     // App version (helpful for debugging)
  });
};
