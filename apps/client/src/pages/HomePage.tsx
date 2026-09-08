/**
 * Introduces the WASL product and directs newcomers into onboarding.
 */

import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function HomePage() {
  return (
    <section className="py-20 text-center">
      <title>WASL | Find your next step in Türkiye</title>
      <h1 className="text-4xl font-bold">Your next step in Türkiye, made clearer.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
        Discover verified communities, practical resources, and a grounded roadmap for your arrival.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/onboarding">Build my roadmap</Link>
      </Button>
    </section>
  );
}
