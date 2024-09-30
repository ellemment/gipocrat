// app/routes/account+/_beta+/$version/application.tsx
import { useParams } from '@remix-run/react';

export default function BetaVersionApplication() {
  const { version } = useParams();
  return <h2>Application for Beta {version}</h2>;
}
