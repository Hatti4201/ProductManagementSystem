import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="h-[64px]" />
      <main className="flex-1 bg-gray-50 py-6">
        <div className="max-w-screen-xl w-full mx-auto px-4 md:px-8 lg:px-16">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}