import { liveQuery } from 'dexie'
import { useEffect, useState } from 'react'

export interface LiveResult<T> {
  /** undefined while the first result is still loading. */
  data: T | undefined
  error: Error | undefined
}

/**
 * Subscribes a component to an IndexedDB query. The component re-renders
 * whenever any table the query reads changes, so lists stay current after edits.
 *
 * Wrap results that can legitimately be undefined (for example a single record
 * lookup) in an object, so "still loading" and "not found" can be told apart.
 */
export function useLiveData<T>(
  query: () => T | Promise<T>,
  deps: readonly unknown[] = [],
): LiveResult<T> {
  // A string key gives the effect a literal dependency list; deps are plain ids and filters.
  const depsKey = JSON.stringify(deps)
  const [state, setState] = useState<LiveResult<T>>({ data: undefined, error: undefined })

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: (data) => setState({ data, error: undefined }),
      error: (error: unknown) =>
        setState({
          data: undefined,
          error: error instanceof Error ? error : new Error(String(error)),
        }),
    })
    return () => subscription.unsubscribe()
    // The query function is intentionally not a dependency: only changes in deps re-subscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey])

  return state
}
