import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data/atlas-db.json');

if (!fs.existsSync(DB_FILE)) {
  console.error('DB_FILE not found');
  process.exit(1);
}

const raw = fs.readFileSync(DB_FILE, 'utf-8');
const data = JSON.parse(raw);

const yearNames = ['I Year', 'II Year', 'III Year', 'IV Year'];
const semNames = ['I Semester', 'II Semester', 'III Semester', 'IV Semester', 'V Semester', 'VI Semester', 'VII Semester', 'VIII Semester'];

console.log(`Current branches: ${data.branches.length}`);
console.log(`Current academicYears: ${data.academicYears.length}`);
console.log(`Current semesters: ${data.semesters.length}`);

// We want to ensure every branch has all 4 academic years and all 8 semesters
for (const branch of data.branches) {
  const code = branch.code.toLowerCase();
  console.log(`Processing branch ${branch.code} (${branch.id})...`);

  // 1. Ensure 4 academic years exist for this branch
  for (let y = 1; y <= 4; y++) {
    // Check if year already exists
    let ay = data.academicYears.find(
      (a) => a.branchId === branch.id && (a.yearNumber === y || a.id === `ay-${code}-${y}` || (branch.code === 'CSE' && a.id === `ay-${y}`))
    );

    if (!ay) {
      ay = {
        id: `ay-${code}-${y}`,
        branchId: branch.id,
        yearNumber: y,
        name: yearNames[y - 1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.academicYears.push(ay);
      console.log(`  + Added Year ${y}: ${ay.name} (${ay.id})`);
    } else {
      // Fix name or yearNumber if misaligned
      ay.name = yearNames[y - 1];
      ay.yearNumber = y;
    }

    // 2. Ensure each year has its 2 semesters
    const sem1Num = (y - 1) * 2 + 1;
    const sem2Num = (y - 1) * 2 + 2;

    for (const semNum of [sem1Num, sem2Num]) {
      // Check if semester already exists for this branch/number
      let sem = data.semesters.find(
        (s) =>
          (s.semNumber === semNum && (s.id.includes(code) || (branch.code === 'CSE' && (s.id === `sem-${semNum}` || s.id === `sem-cse-${semNum}`))))
      );

      if (!sem) {
        const semId = branch.code === 'CSE' && (semNum === 6 || semNum === 7) ? `sem-${semNum}` : `sem-${code}-${semNum}`;
        sem = {
          id: semId,
          academicYearId: ay.id,
          semNumber: semNum,
          name: semNames[semNum - 1],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.semesters.push(sem);
        console.log(`    + Added Semester ${semNum}: ${sem.name} under ${ay.name} (${sem.id})`);
      } else {
        // Ensure semester is linked to correct academic year (e.g. sem 7 must be in Year 4!)
        sem.academicYearId = ay.id;
        sem.name = semNames[semNum - 1];
        sem.semNumber = semNum;
      }

      // 3. Ensure each semester has at least sections A and B
      const existingSections = data.sections.filter((sec) => sec.semesterId === sem.id);
      if (existingSections.length === 0) {
        const secA = {
          id: `sec-${code}${semNum}-a`,
          semesterId: sem.id,
          name: `${branch.code}-A`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const secB = {
          id: `sec-${code}${semNum}-b`,
          semesterId: sem.id,
          name: `${branch.code}-B`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.sections.push(secA, secB);
        console.log(`      + Added Sections ${secA.name}, ${secB.name} for ${sem.name}`);
      }
    }
  }
}

// Make sure semesters array is sorted by semNumber
data.semesters.sort((a, b) => a.semNumber - b.semNumber);
data.academicYears.sort((a, b) => a.yearNumber - b.yearNumber);

fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log('\nUpdated atlas-db.json successfully:');
console.log(`Total academicYears: ${data.academicYears.length}`);
console.log(`Total semesters: ${data.semesters.length}`);
console.log(`Total sections: ${data.sections.length}`);
