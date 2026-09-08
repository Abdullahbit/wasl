import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Landing from '../pages/Landing';
import Onboarding from '../pages/Onboarding';
import Plan from '../pages/Plan';
import Discover from '../pages/Discover';
import CommunityDetail from '../pages/CommunityDetail';
import Resources from '../pages/Resources';
import { LanguageProvider } from '../context/LanguageContext';

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-[#fdf8f2]">
    <TopNav />
    <main className="flex-grow">
      <Outlet />
    </main>
    <footer className="text-center text-xs text-[#6b7a8a] py-8">© WASL — A brighter tomorrow in Istanbul</footer>
  </div>
);

const About = () => (
  <div className="max-w-[800px] mx-auto px-6 py-12 text-start">
    <h1 className="text-3xl font-bold text-[#1e3a5f]">About WASL</h1>
    <p className="mt-4 text-[#4a5a6a]">WASL connects Arabic-speaking international students with trusted resources and welcoming communities across Istanbul.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'plan', element: <Plan /> },
      { path: 'communities', element: <Discover /> },
      { path: 'communities/:id', element: <CommunityDetail /> },
      { path: 'resources', element: <Resources /> },
      { path: 'about', element: <About /> },
      { path: 'discover', element: <Discover /> },
    ],
  },
]);

export const AppRouter = () => (
  <LanguageProvider>
    <RouterProvider router={router} />
  </LanguageProvider>
);
