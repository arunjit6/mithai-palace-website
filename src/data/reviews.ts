import { TBA, type Maybe } from './tba';

export interface Review {
  name: string;
  /** e.g. 'Oct 2026' */
  date: string;
  text: string;
}

// ── Paste real customer reviews here (e.g. copied from Google, with permission) ──
// The reviews section stays hidden until there is at least one review or a Google link.
export const reviews: Review[] = [];

/** Link to the shop's Google reviews, e.g. 'https://g.page/r/…/review' */
export const googleReviewsUrl: Maybe<string> = TBA;
