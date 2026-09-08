/**
 * Read-only presentation of the user's current profile, with clear typography,
 * badges for interests and goals, and guidance on how WASL personalizes recommendations.
 */

import { Link } from 'react-router-dom';
import type { ProfileResponse } from '@wasl/contracts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Heading1, Lead } from '../../components/ui/typography';

interface ProfileViewProps {
  profile: ProfileResponse;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Heading1 className="text-3xl sm:text-4xl">Profile</Heading1>
          <Lead className="text-base sm:text-lg">
            Your information helps WASL personalize your plan and recommendations.
          </Lead>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={onEdit} variant="default" className="w-full sm:w-auto">
            Edit profile
          </Button>
        </div>
      </header>

      {/* Personal & Academic Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Personal & Academic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="City" value={profile.city} />
          <DetailItem label="University" value={profile.university} />
          <DetailItem label="Specialization" value={profile.specialization} />
          <DetailItem label="Arrival stage" value={profile.arrivalStage} />
          <DetailItem label="Turkish level" value={profile.turkishLevel} />
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="pill" className="text-sm">
                  <bdi dir="auto">{interest}</bdi>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not provided</p>
          )}
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.goals && profile.goals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.goals.map((goal) => (
                <Badge key={goal} variant="pill" className="text-sm">
                  <bdi dir="auto">{goal}</bdi>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not provided</p>
          )}
        </CardContent>
      </Card>

      {/* Next steps CTA */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
        <div>
          <p className="font-bold text-foreground">Explore your personalized recommendations</p>
          <p className="text-sm text-muted-foreground">
            Communities and next steps tailored to your academic background and interests.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/plan">View personalized plan</Link>
        </Button>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <p className="text-base font-medium text-foreground">
        {value && value.trim().length > 0 ? (
          <bdi dir="auto">{value}</bdi>
        ) : (
          <span className="text-muted-foreground italic">Not provided</span>
        )}
      </p>
    </div>
  );
}
