import { Metadata } from 'next';
import { FacultyLogin } from '@/components/auth/FacultyLogin';

export const metadata: Metadata = {
  title: 'Faculty Portal Login | Engineering Atlas',
  description: 'Sign in to access your classes, syllabus materials, student assignments, and academic workspace.',
};

export default function FacultyLoginPage() {
  return <FacultyLogin />;
}
