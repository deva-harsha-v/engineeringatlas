import { NextResponse } from 'next/server';
import { getRegisteredEngines } from '@/lib/atlas/visualization-registry';

export async function GET() {
  try {
    const engines = getRegisteredEngines();
    return NextResponse.json({ success: true, data: engines });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
