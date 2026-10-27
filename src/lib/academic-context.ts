import { NextRequest } from 'next/server';
import { db } from './db';
import { AcademicProfile } from './types';

export interface ResolvedAcademicContext {
  branchCode: string;
  branchId?: string;
  branchName?: string;
  yearNumber: number;
  yearName?: string;
  semesterNumber: number;
  semesterName?: string;
  semesterId?: string;
  sectionId: string;
  sectionName?: string;
}

export const FALLBACK_PROFILE: AcademicProfile = {
  branch: 'CSE',
  branchName: 'Computer Science & Engineering',
  year: 4,
  yearName: 'IV Year',
  semester: 7,
  semesterName: 'VII Semester',
  section: 'CSE-A',
  sectionId: 'sec-csea',
  studentName: 'Aspirant',
};

/**
 * Extracts and resolves the verified Academic Context for a student request
 * from cookies, custom headers, or query parameters.
 */
export async function getStudentAcademicContextFromRequest(
  req: NextRequest
): Promise<ResolvedAcademicContext> {
  // 1. Check cookies
  let cookieProfile: Partial<AcademicProfile> | null = null;
  const rawCookie = req.cookies.get('ea_academic_context')?.value;
  if (rawCookie) {
    try {
      cookieProfile = JSON.parse(decodeURIComponent(rawCookie));
    } catch (e) {
      // ignore parse error
    }
  }

  const cookieSectionId = req.cookies.get('ea_section_id')?.value;
  const cookieBranch = req.cookies.get('ea_branch_code')?.value;
  const cookieSemester = req.cookies.get('ea_semester')?.value;
  const cookieYear = req.cookies.get('ea_year')?.value;

  // 2. Check custom headers
  let headerProfile: Partial<AcademicProfile> | null = null;
  const rawHeader = req.headers.get('x-academic-context');
  if (rawHeader) {
    try {
      headerProfile = JSON.parse(decodeURIComponent(rawHeader));
    } catch (e) {
      // ignore parse error
    }
  }
  const headerSectionId = req.headers.get('x-academic-section');

  // 3. Check query parameters
  const { searchParams } = new URL(req.url);
  const paramSectionId = searchParams.get('sectionId');
  const paramBranch = searchParams.get('branch') || searchParams.get('branchCode');
  const paramSemester = searchParams.get('semester');
  const paramYear = searchParams.get('year');

  // Candidate section ID
  let targetSectionId =
    cookieSectionId ||
    cookieProfile?.sectionId ||
    headerSectionId ||
    headerProfile?.sectionId ||
    paramSectionId ||
    FALLBACK_PROFILE.sectionId ||
    'sec-csea';

  // Candidate section name
  let targetSectionName =
    cookieProfile?.section ||
    headerProfile?.section ||
    FALLBACK_PROFILE.section;

  // Candidate branch
  let targetBranchCode =
    cookieBranch ||
    cookieProfile?.branch ||
    headerProfile?.branch ||
    paramBranch ||
    FALLBACK_PROFILE.branch;

  // Candidate year
  let targetYear = Number(
    cookieYear ||
    cookieProfile?.year ||
    headerProfile?.year ||
    paramYear ||
    FALLBACK_PROFILE.year
  );

  // Candidate semester
  let targetSemester = Number(
    cookieSemester ||
    cookieProfile?.semester ||
    headerProfile?.semester ||
    paramSemester ||
    FALLBACK_PROFILE.semester
  );

  // Query database hierarchy to resolve canonical relations
  try {
    const structure = await db.getAcademicStructure();
    const allSections = await db.sections.findMany();

    // Match section by ID first, then by name
    const matchedSection =
      allSections.find((s) => s.id === targetSectionId) ||
      allSections.find((s) => s.name === targetSectionId) ||
      (targetSectionName ? allSections.find((s) => s.name === targetSectionName) : null);

    if (matchedSection) {
      targetSectionId = matchedSection.id;
      targetSectionName = matchedSection.name;

      for (const b of structure.branches) {
        for (const y of b.years) {
          for (const s of y.semesters) {
            if (s.id === matchedSection.semesterId) {
              return {
                branchCode: b.code,
                branchId: b.id,
                branchName: b.name,
                yearNumber: y.yearNumber,
                yearName: y.name,
                semesterNumber: s.semNumber,
                semesterName: s.name,
                semesterId: s.id,
                sectionId: matchedSection.id,
                sectionName: matchedSection.name,
              };
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error resolving academic structure in getStudentAcademicContextFromRequest:', err);
  }

  // Fallback to validated defaults
  return {
    branchCode: targetBranchCode,
    yearNumber: targetYear,
    semesterNumber: targetSemester,
    sectionId: targetSectionId,
    sectionName: targetSectionName,
  };
}
