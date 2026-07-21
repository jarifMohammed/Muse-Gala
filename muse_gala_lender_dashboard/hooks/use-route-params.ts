import { use } from "react";

/**
 * A custom hook to unwrap route parameters in Next.js
 *
 * In newer versions of Next.js, route params are now a Promise
 * that needs to be unwrapped with React.use() before accessing properties.
 *
 * @param params The route parameters object from the page props
 * @returns The unwrapped route parameters
 *
 * @example
 * // In a page component:
 * export default function Page({ params }: { params: { id: string } }) {
 *   const { id } = useRouteParams(params);
 *   // Now use id directly
 * }
 */
export function useRouteParams<T>(params: T): T {
  try {
    // Try to unwrap the params with use()
    return use(params as any);
  } catch (error) {
    // If params is not a Promise (for backward compatibility),
    // just return the params as is
    console.warn(
      "Warning: useRouteParams was called with a non-Promise params object. " +
        "This might be due to using an older version of Next.js or a test environment. " +
        "Returning the params object as is."
    );
    return params;
  }
}
