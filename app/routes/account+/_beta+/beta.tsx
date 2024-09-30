import { Link, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Icon } from '#app/components/ui/icon';

interface BetaVersion {
  version: string;
  status: 'active' | 'inactive';
}

interface LoaderData {
  betaVersions: BetaVersion[];
  apiAccessible: boolean;
}

export const loader: LoaderFunction = async () => {
  // Simulating an API call that fails
  const betaVersions: BetaVersion[] = [
    { version: 'v1.0', status: 'inactive' },
    { version: 'v2.0', status: 'inactive' },
    { version: 'v3.0', status: 'inactive' },
  ];
  return json({ betaVersions, apiAccessible: false });
};

export default function BetaIndex() {
  const { betaVersions, apiAccessible } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Beta Versions</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {betaVersions.map((beta) => (
          <Link
            key={beta.version}
            to={`/account/beta/${beta.version}`}
            className="block p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Beta {beta.version}
              </h2>
              <Icon
                name="cross-circled"
                className="w-6 h-6 text-red-500"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Inactive
            </p>
          </Link>
        ))}
      </div>

      {!apiAccessible && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon name="exclamation-triangle" className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong className="font-medium">Notice:</strong> The API is currently inaccessible. Beta versions may not reflect their actual status. Please check back later or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>
      )}

      {betaVersions.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-center mt-8">
          No beta versions available at the moment.
        </p>
      )}
    </div>
  );
}