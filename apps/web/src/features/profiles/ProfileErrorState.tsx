import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

interface ProfileErrorStateProps {
  error?: Error;
  onRetry: () => void;
  isNotFound?: boolean;
}

export function ProfileErrorState({ error: _error, onRetry, isNotFound }: ProfileErrorStateProps) {
  if (isNotFound) {
    return (
      <Card className="max-w-2xl text-center p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">No profile found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You have not created a WASL profile yet. Get started by completing onboarding to get personalized recommendations and next steps.
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link to="/onboarding">Start Onboarding</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl p-8" role="alert">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-destructive">Unable to load profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          We couldn't load your profile. Please try again.
        </p>
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
