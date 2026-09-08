/**
 * Introduces the WASL product and directs newcomers into onboarding.
 */

import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="py-20 text-center">
      <title>WASL | Find your next step in Türkiye</title>
      <h1 className="text-4xl font-bold">Your next step in Türkiye, made clearer.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-gray-600">
        Discover verified communities, practical resources, and a grounded roadmap for your arrival.
      </p>
      <Link
        to="/onboarding"
        className="mt-8 inline-flex rounded-md bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
      >
        Build my roadmap
      </Link>
    </section>
  );
}
