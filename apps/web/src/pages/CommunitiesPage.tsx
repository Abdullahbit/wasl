/**
 * Renders verified communities using TanStack Query-owned server state.
 */

import { useQuery } from '@tanstack/react-query';
import { communityQueryKeys, getCommunities } from '../features/communities/communityApi';
import { useAppSelector } from '../store/hooks';

export function CommunitiesPage() {
  const selectedCity = useAppSelector((state) => state.preferences.selectedCity);
  const communitiesQuery = useQuery({
    queryKey: communityQueryKeys.list(selectedCity),
    queryFn: () => getCommunities(selectedCity),
  });

  if (communitiesQuery.isPending) {
    return <p role="status">Loading communities…</p>;
  }

  if (communitiesQuery.isError) {
    return <p role="alert">{communitiesQuery.error.message}</p>;
  }

  return (
    <section>
      <title>Communities | WASL</title>
      <h1 className="text-3xl font-bold">Verified communities</h1>
      {communitiesQuery.data.data.length === 0 ? (
        <p className="mt-6 text-gray-600">No communities match these preferences yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {communitiesQuery.data.data.map((community) => (
            <li key={community.id} className="rounded-lg border bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">{community.name}</h2>
              <p className="mt-2 text-gray-600">{community.description}</p>
              <p className="mt-3 text-sm font-medium text-blue-700">{community.category}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
