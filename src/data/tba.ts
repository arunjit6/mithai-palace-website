/**
 * Marker for facts the owner hasn't supplied yet.
 * Anything set to TBA renders as a friendly placeholder ("Call for price",
 * "Coming soon") and is listed by `npm run placeholders`.
 */
export const TBA = 'TBA' as const;
export type Maybe<T> = T | typeof TBA;

export const isTBA = (v: unknown): v is typeof TBA => v === TBA;
