import { db } from '../src/lib/db.ts';

async function testStructure() {
  const structure = await db.getAcademicStructure();
  console.log(`Branches found: ${structure.branches.length}`);

  for (const b of structure.branches) {
    console.log(`\nBranch: ${b.name} (${b.code})`);
    console.log(`  Academic Years: ${b.years.length}`);
    for (const y of b.years) {
      console.log(`    - ${y.name} (Year ${y.yearNumber}): ${y.semesters.length} semesters`);
      for (const s of y.semesters) {
        console.log(`        • ${s.name} (Sem ${s.semNumber}): ${s.sections.length} sections [${s.sections.map(sec => sec.name).join(', ')}]`);
      }
    }
  }
}

testStructure().catch(console.error);
