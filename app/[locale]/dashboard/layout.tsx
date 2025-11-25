import { getSession } from '../../lib/auth-helpers';
import { redirect } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import MobileNav from '../../../components/MobileNav';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  // 未登入則跳轉到登入頁
  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <Sidebar locale={locale} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navigation */}
        <MobileNav locale={locale} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}