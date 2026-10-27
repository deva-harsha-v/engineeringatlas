// Comprehensive QA API Test Suite for Engineering Atlas
const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, options = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const reqOpts = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOpts, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = null;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          rawBody: body,
          json,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runQaTests() {
  console.log('Starting QA API Test Suite...\n');
  const results = [];

  // Helper to log test result
  function logResult(category, testName, expected, actualStatus, pass, details = '') {
    results.push({ category, testName, expected, actualStatus, pass, details });
    const mark = pass ? '✓ PASS' : '✗ FAIL';
    console.log(`[${category}] ${mark}: ${testName} (Status: ${actualStatus}) ${details ? `- ${details}` : ''}`);
  }

  // 1. Auth Tests
  // Login with invalid credentials
  let res = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'invalid@svec.edu', password: 'wrong' }
  });
  logResult('AUTH', 'Login with invalid credentials returns 401', '401', res.status, res.status === 401, res.json?.error);

  // Login with empty body
  res = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  logResult('AUTH', 'Login with empty body returns 400', '400', res.status, res.status === 400, res.json?.error);

  // Valid login as faculty
  res = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'dr.kumar@svec.edu', password: 'password123' }
  });
  logResult('AUTH', 'Faculty login succeeds', '200', res.status, res.status === 200, res.json?.user?.name);
  const facultyCookie = res.headers['set-cookie']?.[0]?.split(';')[0];

  // Valid login as admin
  res = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@svec.edu', password: 'admin123' }
  });
  logResult('AUTH', 'Admin login succeeds', '200', res.status, res.status === 200, res.json?.user?.name);
  const adminCookie = res.headers['set-cookie']?.[0]?.split(';')[0];

  // Auth /me without cookie
  res = await makeRequest('/api/auth/me');
  logResult('AUTH', 'GET /api/auth/me unauthenticated returns 401 or user null', '401 or null', res.status, res.status === 401 || res.json?.user === null);

  // Auth /me with faculty cookie
  res = await makeRequest('/api/auth/me', { headers: { Cookie: facultyCookie } });
  logResult('AUTH', 'GET /api/auth/me authenticated returns user info', '200', res.status, res.status === 200 && res.json?.user?.role === 'FACULTY');

  // Logout
  res = await makeRequest('/api/auth/logout', { method: 'POST', headers: { Cookie: facultyCookie } });
  logResult('AUTH', 'POST /api/auth/logout succeeds', '200', res.status, res.status === 200);

  // 2. Academic Structure Tests
  res = await makeRequest('/api/academic/structure');
  logResult('ACADEMIC', 'GET /api/academic/structure returns structure', '200', res.status, res.status === 200 && !!res.json?.branches);

  // POST /api/academic/structure without admin cookie
  res = await makeRequest('/api/academic/structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: facultyCookie },
    body: { action: 'CREATE_BRANCH', name: 'Test Branch', code: 'TB' }
  });
  logResult('ACADEMIC', 'POST /api/academic/structure as faculty returns 403', '403', res.status, res.status === 403, res.json?.error);

  // 3. Subjects API
  res = await makeRequest('/api/subjects');
  logResult('SUBJECTS', 'GET /api/subjects returns subjects list', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/subjects/sub-os');
  logResult('SUBJECTS', 'GET /api/subjects/sub-os returns single subject', '200', res.status, res.status === 200 && res.json?.code === 'CS701');

  res = await makeRequest('/api/subjects/non-existent-id');
  logResult('SUBJECTS', 'GET /api/subjects/non-existent returns 404', '404', res.status, res.status === 404);

  // 4. Materials API
  res = await makeRequest('/api/materials');
  logResult('MATERIALS', 'GET /api/materials returns materials', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/materials/mat-1');
  logResult('MATERIALS', 'GET /api/materials/mat-1 returns material', '200', res.status, res.status === 200);

  res = await makeRequest('/api/materials/mat-1/download');
  logResult('MATERIALS', 'GET /api/materials/mat-1/download increments download and returns 200', '200', res.status, res.status === 200);

  // POST material without auth
  res = await makeRequest('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: 'Test Mat', subjectId: 'sub-os', fileUrl: '/uploads/test.pdf', fileName: 'test.pdf' }
  });
  logResult('MATERIALS', 'POST /api/materials unauthenticated returns 401', '401', res.status, res.status === 401);

  // POST material with invalid inputs (missing required fields)
  res = await makeRequest('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: facultyCookie },
    body: { title: '' }
  });
  logResult('MATERIALS', 'POST /api/materials with empty title returns 400', '400', res.status, res.status === 400, res.json?.error);

  // 5. Assignments API
  res = await makeRequest('/api/assignments');
  logResult('ASSIGNMENTS', 'GET /api/assignments returns assignments', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/assignments/asg-1');
  logResult('ASSIGNMENTS', 'GET /api/assignments/asg-1 returns assignment', '200', res.status, res.status === 200);

  res = await makeRequest('/api/assignments/non-existent');
  logResult('ASSIGNMENTS', 'GET /api/assignments/non-existent returns 404', '404', res.status, res.status === 404);

  // 6. Papers & Intelligence API
  res = await makeRequest('/api/papers');
  logResult('PAPERS', 'GET /api/papers returns papers', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/papers/intelligence/sub-os');
  logResult('PAPERS', 'GET /api/papers/intelligence/sub-os returns trends', '200', res.status, res.status === 200 && !!res.json?.topicFrequency);

  // 7. Questions API
  res = await makeRequest('/api/questions');
  logResult('QUESTIONS', 'GET /api/questions returns question bank', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/questions/q-1');
  logResult('QUESTIONS', 'GET /api/questions/q-1 returns question', '200', res.status, res.status === 200);

  // 8. Atlas Topics API
  res = await makeRequest('/api/atlas');
  logResult('ATLAS', 'GET /api/atlas returns topics', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/atlas/cpu-scheduling');
  logResult('ATLAS', 'GET /api/atlas/cpu-scheduling returns topic detail', '200', res.status, res.status === 200 && res.json?.slug === 'cpu-scheduling');

  res = await makeRequest('/api/atlas/non-existent-slug');
  logResult('ATLAS', 'GET /api/atlas/non-existent returns 404', '404', res.status, res.status === 404);

  res = await makeRequest('/api/atlas/registry');
  logResult('ATLAS', 'GET /api/atlas/registry returns visualizer registry', '200', res.status, res.status === 200 && !!res.json?.registry);

  // 9. Search API
  res = await makeRequest('/api/search?q=scheduling');
  logResult('SEARCH', 'GET /api/search?q=scheduling returns search results', '200', res.status, res.status === 200 && !!res.json?.subjects);

  res = await makeRequest('/api/search?q=');
  logResult('SEARCH', 'GET /api/search empty query returns empty lists', '200', res.status, res.status === 200 && res.json?.subjects?.length === 0);

  // 10. Faculty APIs
  res = await makeRequest('/api/faculty', { headers: { Cookie: adminCookie } });
  logResult('FACULTY', 'GET /api/faculty as admin returns faculty list', '200', res.status, res.status === 200 && Array.isArray(res.json));

  res = await makeRequest('/api/faculty/assignments', { headers: { Cookie: facultyCookie } });
  logResult('FACULTY', 'GET /api/faculty/assignments as faculty returns assignments', '200', res.status, res.status === 200 && Array.isArray(res.json));

  // 11. Admin APIs
  res = await makeRequest('/api/admin/audit', { headers: { Cookie: adminCookie } });
  logResult('ADMIN', 'GET /api/admin/audit as admin returns audit report', '200', res.status, res.status === 200 && !!res.json?.summary);

  res = await makeRequest('/api/admin/settings', { headers: { Cookie: adminCookie } });
  logResult('ADMIN', 'GET /api/admin/settings as admin returns settings', '200', res.status, res.status === 200 && !!res.json?.institution);

  // 12. Upload API
  res = await makeRequest('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: facultyCookie },
    body: { fileName: 'test.pdf', fileData: 'data:application/pdf;base64,SGVsbG8=' }
  });
  logResult('UPLOAD', 'POST /api/upload returns upload URL', '200', res.status, res.status === 200 && !!res.json?.fileUrl);

  console.log('\n====================================================');
  console.log(`QA API TESTING COMPLETE. Total Tests: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.pass).length}, Failed: ${results.filter(r => !r.pass).length}`);
  console.log('====================================================');
}

runQaTests();
