/**
 * Introduces the WASL product and directs newcomers into onboarding.
 */

import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heading1, Heading2, Heading3, Lead, Kicker } from '../components/ui/typography';

export function HomePage() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      <section className="flex flex-col gap-4">
        <Kicker>Design System</Kicker>
        <Heading1>Foundation Showcase</Heading1>
        <Lead>This page demonstrates the core components built to match the WASL mockup visual direction.</Lead>
      </section>

      <section className="flex flex-col gap-4">
        <Heading2>Typography</Heading2>
        <div className="flex flex-col gap-4 border p-6 rounded-2xl bg-card shadow-soft">
          <Heading1>Heading 1 (Clamp 40-72px)</Heading1>
          <Heading2>Heading 2 (34px)</Heading2>
          <Heading3>Heading 3 (20px)</Heading3>
          <Lead>Lead Paragraph (19px, muted, max-w-690)</Lead>
          <Kicker>Kicker Text</Kicker>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading2>Buttons</Heading2>
        <div className="flex flex-wrap gap-4 border p-6 rounded-2xl bg-card shadow-soft items-center">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading2>Badges & Pills</Heading2>
        <div className="flex flex-wrap gap-4 border p-6 rounded-2xl bg-card shadow-soft items-center">
          <Badge variant="pill">Default Pill</Badge>
          <Badge variant="pillActive">Active Pill</Badge>
          <Badge variant="verified">✓ Verified</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Heading2>Cards / Panels</Heading2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Standard Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <Lead>This is a standard card with 20px border radius and 28px padding, matching the `.panel` class in the mockup.</Lead>
            </CardContent>
          </Card>
          <Card className="rounded-[28px] bg-primary text-primary-foreground border-transparent">
            <CardHeader>
              <CardTitle className="text-primary-foreground">XL Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[19px] text-primary-muted max-w-[690px] m-0">This card uses the 28px radius variant and inverted colors for emphasis.</p>
              <div className="mt-6">
                 <Button variant="secondary" className="bg-card text-foreground">Action</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
