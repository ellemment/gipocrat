// app/routes/account+/_beta+/$version/index.tsx
import { useParams, Link } from '@remix-run/react';

export default function BetaVersionIndex() {
  const { version } = useParams();
  return (
    <div>
      <h2>Beta {version}</h2>
      <nav>
        <Link to="overview">Overview</Link>
        <Link to="application">Application</Link>
        <Link to="changelog">Changelog</Link>
      </nav>
    </div>
  );
}