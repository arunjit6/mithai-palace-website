import { TBA, type Maybe } from './tba';

export interface BoxSize {
  name: string;
  weight: string;
  serves: string;
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
  { name: 'Petite Box', weight: '250 g', serves: 'A thoughtful gift for friends and neighbours', price: TBA },
  { name: 'Classic Box', weight: '500 g', serves: 'Ideal for a visit or a small family', price: TBA },
  { name: 'Palace Box', weight: '1 kg', serves: 'For the family table and big celebrations', price: TBA },
];

export const festivals: Festival[] = [
  { id: 'diwali', name: 'Diwali', blurb: 'Festive assortments of barfi, ladoo and kaju katli for the festival of lights.', active: true },
  { id: 'eid', name: 'Eid', blurb: 'Celebration boxes to share with family, friends and neighbours.', active: true },
  { id: 'raksha-bandhan', name: 'Raksha Bandhan', blurb: 'Sweet boxes to go with rakhi, for brothers and sisters near and far.', active: true },
  { id: 'weddings', name: 'Weddings & Baby Showers', blurb: 'Custom boxes and bulk orders for guests, favours and ceremonies.', active: true },
];

export const activeFestivals = (): Festival[] => festivals.filter(f => f.active);
