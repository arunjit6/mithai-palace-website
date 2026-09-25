import { TBA, type Maybe } from './tba';

export interface MenuItem {
  name: string;
  description: string;
  price: Maybe<number>;
  unit: 'kg' | 'piece' | 'dozen';
  featured?: boolean;
  /** Small tag on the card */
  badge?: 'Best seller' | 'New' | 'Festival special';
  /** Path under /public, e.g. '/images/kaju-katli.jpg' */
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  blurb: string;
  items: MenuItem[];
}

// ── Edit the menu and prices here. Replace TBA with a number, e.g. price: 38 ──
export const menu: MenuCategory[] = [
  {
    id: 'barfi',
    name: 'Barfi',
    blurb: 'Rich, fudge-like squares made from reduced milk, nuts and gram flour.',
    items: [
      { name: 'Kaju Katli', description: 'Silky cashew diamonds finished with edible silver leaf.', price: TBA, unit: 'kg', featured: true, badge: 'Festival special' }, // CONFIRM badge,
      { name: 'Plain Milk Barfi', description: 'Slow-reduced milk and sugar, lightly scented with cardamom.', price: TBA, unit: 'kg' },
      { name: 'Pista Barfi', description: 'Milk barfi layered with ground pistachio.', price: TBA, unit: 'kg' },
      { name: 'Coconut Barfi', description: 'Soft squares of coconut cooked in milk.', price: TBA, unit: 'kg' },
      { name: 'Besan Barfi', description: 'Roasted gram flour and ghee, set and cut into squares.', price: TBA, unit: 'kg' },
    ],
  },
  {
    id: 'ladoo',
    name: 'Ladoo',
    blurb: 'Round, hand-rolled sweets at the heart of every celebration.',
    items: [
      { name: 'Motichoor Ladoo', description: 'Tiny pearls of gram flour batter, soaked in syrup and rolled by hand.', price: TBA, unit: 'kg', featured: true, badge: 'Festival special' }, // CONFIRM badge,
      { name: 'Besan Ladoo', description: 'Gram flour slow-roasted in ghee with cardamom.', price: TBA, unit: 'kg', featured: true },
      { name: 'Coconut Ladoo', description: 'Coconut and condensed milk rolled into soft rounds.', price: TBA, unit: 'kg' },
      { name: 'Dry Fruit Ladoo', description: 'Dates, figs and nuts pressed together.', price: TBA, unit: 'kg' },
    ],
  },
  {
    id: 'halwa',
    name: 'Halwa',
    blurb: 'Warm, spoonable sweets cooked slowly in ghee.',
    items: [
      { name: 'Gajar Halwa', description: 'Grated carrot simmered in milk, finished with ghee and nuts.', price: TBA, unit: 'kg', featured: true },
      { name: 'Moong Dal Halwa', description: 'Lentils roasted in ghee until golden and fragrant.', price: TBA, unit: 'kg' },
      { name: 'Sooji Halwa', description: 'Semolina halwa with cardamom and raisins.', price: TBA, unit: 'kg' },
    ],
  },
  {
    id: 'milk-sweets',
    name: 'Milk Sweets',
    blurb: 'Syrup-soaked and milk-based favourites, served chilled or warm.',
    items: [
      { name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose and cardamom syrup.', price: TBA, unit: 'kg', featured: true },
      { name: 'Rasgulla', description: 'Spongy cottage-cheese balls in light sugar syrup.', price: TBA, unit: 'kg', featured: true },
      { name: 'Rasmalai', description: 'Cheese patties in saffron-cardamom milk with pistachio.', price: TBA, unit: 'piece', featured: true },
      { name: 'Kalakand', description: 'Grainy, moist milk cake set with cardamom.', price: TBA, unit: 'kg' },
      { name: 'Milk Cake', description: 'Caramelised milk, slow-cooked until golden at the centre.', price: TBA, unit: 'kg', featured: true },
    ],
  },
  {
    id: 'namkeen',
    name: 'Namkeen & Snacks',
    blurb: 'Savoury bites to balance the sweet.',
    items: [
      { name: 'Samosa', description: 'Crisp pastry filled with spiced potato and peas.', price: TBA, unit: 'piece' },
      { name: 'Kachori', description: 'Flaky, puffed pastry with a spiced lentil filling.', price: TBA, unit: 'piece' },
      { name: 'Namkeen Mixture', description: 'Crunchy mix of sev, nuts, lentils and spices.', price: TBA, unit: 'kg' },
      { name: 'Aloo Bhujia', description: 'Fine, crisp potato and gram flour noodles.', price: TBA, unit: 'kg' },
    ],
  },
];

export const featuredItems = (): MenuItem[] => menu.flatMap(c => c.items).filter(i => i.featured);
