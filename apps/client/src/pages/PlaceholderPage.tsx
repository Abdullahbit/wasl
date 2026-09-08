/**
 * Marks feature routes whose product UI can be developed independently by teammates.
 */

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section>
      <title>{title} | WASL</title>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </section>
  );
}
