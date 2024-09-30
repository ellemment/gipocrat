// app/routes/account+/_beta+/$version/changelog.tsx
import { useParams } from '@remix-run/react';

export default function BetaVersionChangelog() {
  const { version } = useParams();
  return <h2>Changelog for Beta {version}</h2>;
}