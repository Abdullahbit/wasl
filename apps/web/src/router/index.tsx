import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-blue-600">WASL</Link>
        <nav className="flex space-x-4">
          <Link to="/onboarding" className="text-gray-600 hover:text-gray-900">Onboarding</Link>
          <Link to="/plan" className="text-gray-600 hover:text-gray-900">Plan</Link>
          <Link to="/communities" className="text-gray-600 hover:text-gray-900">Communities</Link>
          <Link to="/resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
        </nav>
      </div>
    </header>
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </main>
  </div>
);

// Placeholder pages
const Landing = () => <div className="text-center py-20"><h1 className="text-4xl font-bold">Welcome to WASL</h1><p className="mt-4 text-gray-600">Smart Community Navigation for International Students in Türkiye.</p></div>;
const Onboarding = () => <div><h1 className="text-2xl font-bold mb-4">Smart Onboarding</h1><p>Placeholder for the onboarding form.</p></div>;
const Plan = () => <div><h1 className="text-2xl font-bold mb-4">Your Roadmap</h1><p>Placeholder for the AI-generated plan.</p></div>;
const Communities = () => <div><h1 className="text-2xl font-bold mb-4">Communities</h1><p>Placeholder for recommended communities.</p></div>;
const CommunityDetails = () => <div><h1 className="text-2xl font-bold mb-4">Community Details</h1><p>Placeholder for community details.</p></div>;
const Resources = () => <div><h1 className="text-2xl font-bold mb-4">Resources</h1><p>Placeholder for resources.</p></div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'plan', element: <Plan /> },
      { path: 'communities', element: <Communities /> },
      { path: 'communities/:id', element: <CommunityDetails /> },
      { path: 'resources', element: <Resources /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
