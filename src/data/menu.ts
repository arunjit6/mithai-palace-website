import { TBA, type Maybe } from './tba';

export interface MenuItem {
  name: string;
  description: string;
  price: Maybe<number>;
  unit: 'box' | 'kg' | 'piece' | 'dozen';
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

// ── Edit the menu and prices here. Replace TBA with a number, e.g. price: 25 ──
// Matches the gift-box range in src/assets/photos (see that folder's README).
export const menu: MenuCategory[] = [
  {
    id: 'kaju-katli',
    name: 'Kaju Katli',
    blurb: 'Silky cashew fudge, cut into diamonds — our signature katli and its flavoured variations.',
    items: [
      { name: 'Kaju Katli', description: 'Classic cashew fudge diamonds, finished with edible silver leaf.', price: TBA, unit: 'box', featured: true },
      { name: 'Kesar Badam Katli', description: 'Almond fudge diamonds threaded with saffron.', price: TBA, unit: 'box', featured: true },
      { name: 'Kaju Katli Pista', description: 'Cashew fudge layered with ground pistachio.', price: TBA, unit: 'box', featured: true },
      { name: 'Kaju Katli Mango', description: 'Cashew fudge with a mango flavour.', price: TBA, unit: 'box' },
      { name: 'Kaju Katli Blueberry', description: 'Cashew fudge with a blueberry flavour.', price: TBA, unit: 'box' },
    ],
  },
  {
    id: 'kaju-creations',
    name: 'Kaju Creations',
    blurb: 'Cashew fudge reimagined as rolls and bars, with fillings from chocolate to caramelised biscuit.',
    items: [
      { name: 'Hazelnut Kaju Luxe', description: 'Cashew fudge with roasted hazelnuts.', price: TBA, unit: 'box' },
      { name: 'Kaju Chocolate Roll', description: 'Cashew fudge rolled with chocolate.', price: TBA, unit: 'box' },
      { name: 'Kaju Strawberry Roll', description: 'Cashew fudge rolled with strawberry.', price: TBA, unit: 'box' },
      { name: 'Kaju Hazelnut Chocolate Crunch', description: 'Cashew fudge bar with hazelnut chocolate and a crunchy nut topping.', price: TBA, unit: 'box' },
      { name: 'Kaju Caramel Biscuit', description: 'Cashew fudge bar layered with caramelised biscuit crumb.', price: TBA, unit: 'box' },
    ],
  },
  {
    id: 'gourmet-bites',
    name: 'Gourmet Bites',
    blurb: 'Small, richly flavoured squares — a little of something special.',
    items: [
      { name: 'Dry Fruit Bites', description: 'Bite-sized squares packed with mixed nuts and dried fruit.', price: TBA, unit: 'box' },
      { name: 'Pista Bites', description: 'Pistachio-topped bites.', price: TBA, unit: 'box' },
      { name: 'Rose Bites', description: 'Rose-flavoured bites finished with pistachio.', price: TBA, unit: 'box' },
      { name: 'Vanilla Bites', description: 'Vanilla bites topped with toasted nuts.', price: TBA, unit: 'box' },
    ],
  },
  {
    id: 'classic-sweets',
    name: 'Classic Sweets',
    blurb: 'Time-honoured mithai, each with its own texture and story.',
    items: [
      { name: 'Balushahi', description: 'A flaky, deep-fried disc soaked in sugar syrup.', price: TBA, unit: 'box' },
      { name: 'Banarasi Soan Papdi', description: 'Flaky, layered sweet finished with pistachio and cardamom.', price: TBA, unit: 'box' },
      { name: 'Maharaja Mysore Pak', description: 'Ghee-roasted gram flour fudge, rich and porous.', price: TBA, unit: 'box' },
      { name: 'Rose Delight', description: 'A milk-based sweet topped with rose petals and pistachio.', price: TBA, unit: 'box' },
      { name: 'Anjeer Roll', description: 'Fig and nut roll, sliced into rounds.', price: TBA, unit: 'box' },
    ],
  },
  {
    id: 'milk-syrup-sweets',
    name: 'Milk & Syrup Sweets',
    blurb: 'Soft, syrup-soaked classics, served chilled or at room temperature.',
    items: [
      { name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose and cardamom syrup.', price: TBA, unit: 'box', featured: true },
      { name: 'Sponge Rasgulla', description: 'Spongy cottage-cheese balls in light sugar syrup.', price: TBA, unit: 'box', featured: true },
      { name: 'Kanpuri Motichur Laddu', description: 'Fine gram-flour pearls bound into a syrup-soaked laddu.', price: TBA, unit: 'box', featured: true },
    ],
  },
  {
    id: 'wholesome-treats',
    name: 'Wholesome Treats',
    blurb: 'Nut and fruit-based sweets, for a lighter treat.',
    items: [
      // CONFIRM: "sugar free" removed from these two names until the recipe is confirmed to have no added sugar
      { name: 'Anjeer Burfi', description: 'Fig and nut fudge, pressed and sliced into squares.', price: TBA, unit: 'box' },
      { name: 'Dry Fruit Laddu', description: 'Nuts and dates pressed into a laddu.', price: TBA, unit: 'box' },
    ],
  },
  {
    id: 'namkeen',
    name: 'Namkeen & Snacks',
    blurb: 'Savoury bites to balance the sweet.',
    items: [
      { name: 'Samosa', description: 'Crisp pastry filled with a spiced potato filling.', price: TBA, unit: 'box' },
    ],
  },
];

export const featuredItems = (): MenuItem[] => menu.flatMap(c => c.items).filter(i => i.featured);
