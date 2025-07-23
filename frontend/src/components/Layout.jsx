import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 max-w-screen-2xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
