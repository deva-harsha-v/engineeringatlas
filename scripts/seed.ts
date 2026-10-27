import fs from 'fs';
import path from 'path';
import { getSeedData } from '../src/lib/seed-data';

async function main() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbFile = path.join(dataDir, 'atlas-db.json');
  console.log('Generating seed database for Engineering Atlas...');
  const seed = await getSeedData();

  const store = {
    institution: seed.institution,
    branches: (seed as any).branches || [seed.branch],
    academicYears: (seed as any).academicYears || [seed.academicYear],
    semesters: (seed as any).semesters || [seed.semester],
    sections: seed.sections,
    subjects: seed.subjects,
    users: seed.users,
    facultyAssignments: seed.facultyAssignments,
    materials: seed.materials,
    assignments: seed.assignments,
    questionPapers: seed.questionPapers,
    questions: seed.questions.map((q) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    })),
    atlasTopics: seed.atlasTopics.map((t) => ({
      ...t,
      learningObjectives:
        typeof t.learningObjectives === 'string'
          ? JSON.parse(t.learningObjectives)
          : t.learningObjectives,
    })),
    announcements: seed.announcements,
    analyticsEvents: [
      { id: 'ev-1', type: 'ATLAS_VIEW', targetId: 'cpu-scheduling', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'ev-2', type: 'MATERIAL_DOWNLOAD', targetId: 'mat-1', createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'ev-3', type: 'PRACTICE_SUBMIT', targetId: 'sub-os', metadata: JSON.stringify({ score: 80 }), createdAt: new Date().toISOString() },
    ],
  };

  fs.writeFileSync(dbFile, JSON.stringify(store, null, 2), 'utf-8');
  console.log(`✓ Seed database generated successfully at: ${dbFile}`);
  console.log(`  Branches: ${store.branches.length}`);
  console.log(`  Sections: ${store.sections.length}`);
  console.log(`  Subjects: ${store.subjects.length}`);
  console.log(`  Atlas Topics: ${store.atlasTopics.length}`);
  console.log(`  Materials: ${store.materials.length}`);
  console.log(`  Assignments: ${store.assignments.length}`);
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
