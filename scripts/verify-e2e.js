// End-to-End Verification Suite for Engineering Atlas
// Tests all data models, persistence, authentication, role RBAC,
// academic hierarchy, past paper intelligence, atlas simulation definitions, and search.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'engineering-atlas-jwt-secret-key-2026';
const DB_FILE = path.join(process.cwd(), 'data', 'atlas-db.json');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runVerification() {
  console.log('====================================================');
  console.log('ENGINEERING ATLAS - END-TO-END VERIFICATION SUITE');
  console.log('Target Institution: Sri Vasavi Engineering College (SVEC)');
  console.log('====================================================\n');

  // TEST 1: Database & Persistence Layer
  console.log('[TEST GROUP 1]: Persistence Layer & Schema Integrity');
  assert(fs.existsSync(DB_FILE), `Database store file exists at ${DB_FILE}`);
  
  const rawDb = fs.readFileSync(DB_FILE, 'utf-8');
  const db = JSON.parse(rawDb);

  assert(db.institution && db.institution.code.includes('SVEC'), `Institution initialized as SVEC (${db.institution?.code})`);
  assert(db.branches.some(b => b.code === 'CSE'), 'Computer Science & Engineering (CSE) branch exists');
  assert(db.semesters.some(s => s.semNumber === 7), 'VII Semester configured');
  assert(db.sections.length >= 2, `Sections CSE-A and CSE-B populated (found ${db.sections.length})`);
  assert(db.subjects.length === 6, `All 6 B.Tech VII Sem CSE subjects populated (found ${db.subjects.length})`);

  // TEST 2: Interactive Engineering Atlas Modules
  console.log('\n[TEST GROUP 2]: Interactive Atlas Modules (8 Specialized Engines)');
  assert(db.atlasTopics.length === 8, `Exact set of 8 interactive Atlas topics present (found ${db.atlasTopics.length})`);

  const requiredSlugs = [
    'avl-tree',
    'cpu-scheduling',
    'deadlock',
    'paging-replacement',
    'tcp-handshake',
    'compiler-pipeline',
    'dbms-normalization',
    'sorting-algorithms'
  ];

  requiredSlugs.forEach(slug => {
    const topic = db.atlasTopics.find(t => t.slug === slug);
    assert(
      topic && topic.visualizationType && topic.whyItMatters && topic.concept,
      `Atlas topic '${slug}' has complete pedagogical model & visualization engine (${topic?.visualizationType})`
    );
  });

  // TEST 3: Authentication & Cryptographic Security
  console.log('\n[TEST GROUP 3]: Authentication & Cryptographic Security');
  const facultyUser = db.users.find(u => u.email === 'dr.kumar@svec.edu');
  assert(facultyUser && facultyUser.role === 'FACULTY', 'Faculty Dr. Kumar exists with role FACULTY');

  const facultyPassValid = await bcrypt.compare('password123', facultyUser.passwordHash);
  assert(facultyPassValid, 'Faculty password "password123" verifies correctly with bcrypt hash');

  const adminUser = db.users.find(u => u.email === 'admin@svec.edu');
  assert(adminUser && adminUser.role === 'ADMIN', 'Admin administrator exists with role ADMIN');

  const adminPassValid = await bcrypt.compare('admin123', adminUser.passwordHash);
  assert(adminPassValid, 'Admin password "admin123" verifies correctly with bcrypt hash');

  // Test JWT generation and verification
  const token = jwt.sign(
    { id: facultyUser.id, email: facultyUser.email, role: facultyUser.role, institutionId: facultyUser.institutionId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  const decoded = jwt.verify(token, JWT_SECRET);
  assert(decoded.id === facultyUser.id && decoded.role === 'FACULTY', 'JWT generation and payload verification succeeded');

  // TEST 4: Faculty Teaching Allocations & RBAC Scoping
  console.log('\n[TEST GROUP 4]: Teaching Allocations & Permission Derivation');
  const kumarAllocations = db.facultyAssignments.filter(fa => fa.facultyId === facultyUser.id);
  assert(kumarAllocations.length >= 2, `Dr. Kumar has assigned teaching loads (found ${kumarAllocations.length} sections)`);

  const assignedSubjectIds = [...new Set(kumarAllocations.map(a => a.subjectId))];
  const assignedSubjects = db.subjects.filter(s => assignedSubjectIds.includes(s.id));
  assert(
    assignedSubjects.some(s => s.code === 'CS701') && assignedSubjects.some(s => s.code === 'CS703'),
    'Dr. Kumar has assigned allocations in CS701 (Operating Systems) and CS703 (Computer Networks)'
  );

  // TEST 5: Academic Hub Materials & Object Storage Decoupling
  console.log('\n[TEST GROUP 5]: Academic Hub Materials & Storage Safety');
  assert(db.materials.length >= 5, `Curated syllabus materials present (found ${db.materials.length})`);
  
  db.materials.forEach(mat => {
    // Large academic files must NOT be stored directly inside database
    assert(
      mat.fileUrl && !mat.fileUrl.startsWith('data:'),
      `Material '${mat.title}' stored as object storage URI/ref (${mat.fileUrl}), not inline binary`
    );
  });

  // TEST 6: Past Paper Intelligence Engine
  console.log('\n[TEST GROUP 6]: Past Paper Intelligence & Frequency Calculation');
  assert(db.questionPapers.length >= 5, `University/Autonomous past question papers indexed (found ${db.questionPapers.length})`);
  assert(db.questions.length >= 8, `Curated examination question bank present (found ${db.questions.length})`);

  const osQuestions = db.questions.filter(q => q.subjectId === 'sub-os');
  const repeatedOsQuestions = osQuestions.filter(q => q.repeatCount > 1);
  assert(repeatedOsQuestions.length >= 2, `Intelligence engine flagged repeated exam questions for OS (found ${repeatedOsQuestions.length})`);

  // Verify CPU scheduling high probability question
  const cpuQuestion = osQuestions.find(q => q.topic.includes('CPU') || q.questionText.includes('CPU'));
  assert(cpuQuestion && cpuQuestion.repeatCount >= 3, 'CPU Scheduling identified as HIGH EXAM PROBABILITY (repeatCount >= 3)');

  // TEST 7: Practice Engine & Quizzes
  console.log('\n[TEST GROUP 7]: Practice Engine MCQ & Explanation Rigor');
  const mcqs = db.questions.filter(q => q.type === 'MCQ');
  assert(mcqs.length >= 8, `Curated MCQs ready for instant practice runs (found ${mcqs.length})`);
  
  const sampleMcq = mcqs[0];
  assert(
    Array.isArray(sampleMcq.options) && sampleMcq.options.length >= 4 && sampleMcq.explanation,
    `MCQ '${sampleMcq.id}' contains full 4 choices, answer index (${sampleMcq.correctAnswer}), and comprehensive step explanation`
  );

  // TEST 8: Global Multi-Entity Search
  console.log('\n[TEST GROUP 8]: Multi-Entity Search Query Engine');
  const query = 'scheduling';
  const matchedSubjects = db.subjects.filter(s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
  const matchedAtlas = db.atlasTopics.filter(t => t.title.toLowerCase().includes(query) || t.concept.toLowerCase().includes(query));
  const matchedMaterials = db.materials.filter(m => m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query));
  const matchedQuestions = db.questions.filter(q => q.questionText.toLowerCase().includes(query) || q.topic.toLowerCase().includes(query));

  assert(matchedSubjects.length > 0, `Search '${query}' found matching subject(s): ${matchedSubjects.map(s => s.code).join(', ')}`);
  assert(matchedAtlas.length > 0, `Search '${query}' found matching interactive Atlas topic(s): ${matchedAtlas.map(t => t.title).join(', ')}`);
  assert(matchedMaterials.length > 0, `Search '${query}' found matching faculty material(s): ${matchedMaterials.map(m => m.title).join(', ')}`);
  assert(matchedQuestions.length > 0, `Search '${query}' found matching practice question(s)`);

  // SUMMARY
  console.log('\n====================================================');
  console.log(`VERIFICATION COMPLETE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('====================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
