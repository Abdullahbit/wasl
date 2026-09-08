/**
 * Introduces the WASL product and directs newcomers into onboarding.
 */

import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useTranslation } from '../lib/i18n/useTranslation';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="py-20 text-center">
      <title>{t('home.pageTitle')}</title>
      <h1 className="text-4xl font-bold">{t('home.title')}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('home.description')}</p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/onboarding">{t('home.cta')}</Link>
      </Button>
    </section>
  );
}
