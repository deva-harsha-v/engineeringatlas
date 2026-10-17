import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const topic = await db.atlasTopics.findBySlug(params.slug);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Atlas topic not found.' }, { status: 404 });
    }
    // Increment view count asynchronously
    await db.atlasTopics.incrementView(params.slug);
    await db.analytics.recordEvent('ATLAS_VIEW', params.slug);

    return NextResponse.json({ success: true, data: topic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const topic = await db.atlasTopics.findBySlug(params.slug);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found.' }, { status: 404 });
    }

    const body = await req.json();
    const updated = await db.atlasTopics.update(topic.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const auth = requireRole(req, ['ADMIN']);
  if ('error' in auth) return auth.error;

  try {
    const topic = await db.atlasTopics.findBySlug(params.slug);
    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic not found.' }, { status: 404 });
    }
    await db.atlasTopics.delete(topic.id);
    return NextResponse.json({ success: true, message: 'Atlas topic deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
