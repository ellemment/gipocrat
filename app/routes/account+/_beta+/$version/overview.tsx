// app/routes/account+/_beta+/$version/overview.tsx
import { useParams } from '@remix-run/react';

export default function BetaVersionOverview() {
  const { version } = useParams();
  return <h2>Overview of Beta {version}</h2>;
}
