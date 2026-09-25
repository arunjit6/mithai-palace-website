import { TBA, type Maybe } from './tba';

export interface BoxSize {
  name: string;
  weight: string;
  serves: string;
  /** Short 'which box, for whom?' guide */
  forWhom: string;
  price: Maybe<number>;
}

export interface Festival {
  id: string;
  name: string;
  blurb: string;
  /** Show this festival on the site? Switch on/off through the year. */
  active: boolean;
}

// ── Edit gift boxes here ──────────────────────────────────────────────────
export const boxSizes: BoxSize[] = [
  { name: 'Petite Box', weight: '250 g', forWhom: 'Neighbours & colleagues', serves: 'A thoughtful gift for friends and neighbours', price: TBA },
  { name: 'Classic Box', weight: '500 g', forWhom: 'Family visits & friends', serves: 'Ideal for a visit or a small family', price: TBA },
  { name: 'Palace Box', weight: '1 kg', forWhom: 'The family table', serves: 'A generous assortment for big gatherings', price: TBA },
];

export const festivals: Festival[] = [
  { id: 'diwali', name: 'Diwali', blurb: 'Festive assortments of barfi, ladoo and kaju katli for the festival of lights.', active: true },
  { id: 'eid', name: 'Eid', blurb: 'Celebration boxes to share with family, friends and neighbours.', active: true },
  { id: 'raksha-bandhan', name: 'Raksha Bandhan', blurb: 'Sweet boxes to go with rakhi, for brothers and sisters near and far.', active: true },
  { id: 'weddings', name: 'Weddings & Baby Showers', blurb: 'Custom boxes and bulk orders for guests, favours and ceremonies.', active: true },
];

export interface FestivalBanner {
  /** Show the seasonal banner on the home page? */
  active: boolean;
  festivalId: string;
  title: string;
  text: string;
  /** Festival date as shown to visitors, e.g. 'Sunday 8 November' */
  date: Maybe<string>;
  /** Last day to order, e.g. 'Thursday 29 October' */
  orderBy: Maybe<string>;
}

// Switch on with active: true when festival orders open
export const festivalBanner: FestivalBanner = {
  active: false,
  festivalId: 'diwali',
  title: 'Diwali Gift Boxes',
  text: 'Celebrate the festival of lights with boxes of kaju katli, barfi and ladoo, packed for family, friends and colleagues.',
  date: 'Sunday 8 November',
  orderBy: TBA,
};

export const activeFestivals = (): Festival[] => festivals.filter(f => f.active);
