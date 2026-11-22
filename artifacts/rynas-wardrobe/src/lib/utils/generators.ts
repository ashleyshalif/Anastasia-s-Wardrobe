/**
 * Ryna's Wardrobe — Memory-Efficient Algorithmic Generators
 * Implements JS/TS generator functions (`function*` and `async function*`)
 * for lazy-evaluated, chunked data pipelines and pagination streaming.
 */

/**
 * Lazily splits a collection into memory-efficient chunks using a generator.
 * Time Complexity: O(n) single-pass
 * Space Complexity: O(chunkSize) instead of O(n) duplicated arrays
 */
export function* chunkGenerator<T>(items: T[], chunkSize: number = 20): Generator<T[], void, unknown> {
  for (let i = 0; i < items.length; i += chunkSize) {
    yield items.slice(i, i + chunkSize);
  }
}

/**
 * Lazy async pipeline generator for streaming paginated API data.
 * Consumes pages incrementally without loading unbounded data into browser heap memory.
 */
export async function* asyncPaginateGenerator<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; hasNext: boolean }>,
  startPage: number = 1
): AsyncGenerator<T[], void, unknown> {
  let page = startPage;
  let hasMore = true;

  while (hasMore) {
    const result = await fetchPage(page);
    if (!result.items || result.items.length === 0) {
      break;
    }
    yield result.items;
    hasMore = result.hasNext;
    page += 1;
  }
}

