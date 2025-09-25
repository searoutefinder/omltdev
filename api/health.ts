import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  res.status(200).json({
    ok: true,
    env: process.env.NODE_ENV ?? 'development',
  });
}
