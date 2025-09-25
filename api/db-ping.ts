import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma.js';


export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    console.log('TESTER - REMOVE LATER')
    const orgCount = await prisma.organization.count();
    res.status(200).json({ 
      ok: true, 
      orgCount 
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ 
      ok: false, 
      error: message
     });
  }
}

