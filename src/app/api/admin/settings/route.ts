import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const auth = requireRole(req, ['ADMIN']);
    if ('error' in auth) return auth.error;
    const { user: authUser } = auth;

    const institution = await db.getInstitution();
    const structure = await db.getAcademicStructure();
    const materials = await db.materials.findMany();
    const papers = await db.questionPapers.findMany();
    const questions = await db.questions.findMany();
    const atlasTopics = await db.atlasTopics.findMany();

    // Diagnostics
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let localFileCount = 0;
    let localDirExists = false;
    try {
      localDirExists = fs.existsSync(uploadsDir);
      if (localDirExists) {
        localFileCount = fs.readdirSync(uploadsDir).length;
      }
    } catch {
      // ignore
    }

    const settings = {
      institution: {
        id: institution.id,
        name: institution.name,
        code: institution.code,
        city: institution.city || 'Tadepalligudem',
        state: institution.state || 'Andhra Pradesh',
        shortName: (institution as any).shortName || 'SVEC',
        affiliation: (institution as any).affiliation || 'Autonomous / JNTUK',
        accreditation: (institution as any).accreditation || 'NAAC A+ Grade / NBA Accredited',
      },
      academic: {
        activeAcademicYear: '2026-2027',
        activeSemester: 7,
        activeTermName: 'VII Semester (B.Tech IV Year)',
        branchesCount: structure.branches.length,
        subjectsCount: structure.branches.reduce(
          (acc, b) => acc + b.years.reduce((yAcc, y) => yAcc + y.semesters.reduce((sAcc, s) => sAcc + s.subjects.length, 0), 0),
          0
        ),
      },
      moderation: {
        policy: (institution as any).moderationPolicy || 'DIRECT_PUBLISH', // 'DIRECT_PUBLISH' | 'PRE_MODERATION'
        autoApproveFaculty: true,
        notifyOnFlag: true,
      },
      storage: {
        provider: process.env.STORAGE_PROVIDER || 'local',
        maxUploadSizeMb: 50,
        allowedExtensions: ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.zip'],
        localDirExists,
        localFileCount,
        storageBucket: process.env.STORAGE_BUCKET || 'atlas-storage-dev',
      },
      paperIntelligence: {
        recencyDecayFactor: (institution as any).recencyDecayFactor || 0.85,
        repeatWeightMultiplier: (institution as any).repeatWeightMultiplier || 1.5,
        highPriorityThreshold: (institution as any).highPriorityThreshold || 3,
        totalPapersIndexed: papers.length,
        totalQuestionsBanked: questions.length,
      },
      diagnostics: {
        databaseMode: process.env.DATABASE_URL ? 'PostgreSQL' : 'JSON Atomic Store',
        totalMaterials: materials.length,
        totalPapers: papers.length,
        totalQuestions: questions.length,
        totalAtlasTopics: atlasTopics.length,
        systemStatus: 'HEALTHY',
        lastRefreshed: new Date().toISOString(),
      },
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireRole(req, ['ADMIN']);
    if ('error' in auth) return auth.error;
    const { user: authUser } = auth;

    const body = await req.json();
    const {
      name,
      code,
      city,
      state,
      shortName,
      affiliation,
      accreditation,
      moderationPolicy,
      recencyDecayFactor,
      repeatWeightMultiplier,
      highPriorityThreshold,
    } = body;

    const updated = await db.updateInstitution({
      ...(name && { name }),
      ...(code && { code }),
      ...(city && { city }),
      ...(state && { state }),
      shortName: shortName || 'SVEC',
      affiliation: affiliation || 'Autonomous / JNTUK',
      accreditation: accreditation || 'NAAC A+ Grade',
      moderationPolicy: moderationPolicy || 'DIRECT_PUBLISH',
      recencyDecayFactor: typeof recencyDecayFactor === 'number' ? recencyDecayFactor : 0.85,
      repeatWeightMultiplier: typeof repeatWeightMultiplier === 'number' ? repeatWeightMultiplier : 1.5,
      highPriorityThreshold: typeof highPriorityThreshold === 'number' ? highPriorityThreshold : 3,
    });

    return NextResponse.json({ success: true, institution: updated });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
