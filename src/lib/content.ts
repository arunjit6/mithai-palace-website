import { isTBA, type Maybe } from '../data/tba';
import type { Announcement } from '../data/site';
import type { Review } from '../data/reviews';

export const visibleAnnouncement = (a: Announcement): Announcement | null => (a.active ? a : null);

export const showReviews = (list: Review[], googleUrl: Maybe<string>): boolean => list.length > 0 || !isTBA(googleUrl);
