import fs from 'fs';
import path from 'path';

const files = [
  'src/app/faculty/materials/page.tsx',
  'src/app/faculty/materials/new/page.tsx',
  'src/app/faculty/papers/page.tsx',
  'src/app/faculty/questions/page.tsx',
  'src/app/faculty/announcements/page.tsx',
];

for (const relPath of files) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace hardcoded white backgrounds
  content = content.replace(/backgroundColor:\s*'#FFFFFF'/g, "backgroundColor: 'var(--surface-1)'");
  content = content.replace(/backgroundColor:\s*'#F8FAFC'/g, "backgroundColor: 'var(--surface-2)'");
  content = content.replace(/border:\s*'1px solid #E2E8F0'/g, "border: '1px solid var(--border)'");
  content = content.replace(/borderColor:\s*'#E2E8F0'/g, "borderColor: 'var(--border)'");
  content = content.replace(/borderBottom:\s*'1px solid #E2E8F0'/g, "borderBottom: '1px solid var(--border)'");
  content = content.replace(/borderTop:\s*'1px solid #E2E8F0'/g, "borderTop: '1px solid var(--border)'");
  content = content.replace(/color:\s*'#0F172A'/g, "color: 'var(--text-primary)'");
  content = content.replace(/color:\s*'#1E293B'/g, "color: 'var(--text-primary)'");
  content = content.replace(/color:\s*'#64748B'/g, "color: 'var(--text-secondary)'");

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated theme styles in ${relPath}`);
}
