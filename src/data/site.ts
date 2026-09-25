import { TBA, type Maybe } from './tba';

export interface HoursRow { days: string; open: string }

export interface ShopPromise {
  title: string;
  text: string;
  icon: 'leaf' | 'hands' | 'gift' | 'users';
  /** false until the owner confirms the claim is true */
  confirmed: boolean;
}

export interface Site {
  name: string;
  tagline: string;
  description: string;
  address: {
    line1: string;
    suburb: string;
    state: string;
    postcode: Maybe<string>;
    /** false until the owner confirms the exact address */
    confirmed: boolean;
  };
  /** Display format, e.g. "+61 2 9000 0000" */
  phone: Maybe<string>;
  /** International format, e.g. "61400000000" */
  whatsapp: Maybe<string>;
  email: Maybe<string>;
  hours: Maybe<HoursRow[]>;
  socials: { label: string; url: string }[];
  /** Formspree (or similar) form URL for the enquiry form */
  formEndpoint: Maybe<string>;
  promises: ShopPromise[];
}

// ── Edit shop details here ────────────────────────────────────────────────
export const site: Site = {
  name: 'Mithai Palace',
  tagline: 'Traditionally Sweet',
  description:
    'Mithai Palace is an Indian sweet shop in North Mulgrave, NSW: handcrafted mithai, festive gift boxes and catering for celebrations.',
  address: {
    line1: 'Shop 12, 87–91 Railway Road',
    suburb: 'North Mulgrave',
    state: 'NSW',
    postcode: TBA,
    confirmed: false,
  },
  phone: TBA,
  whatsapp: TBA,
  email: TBA,
  hours: TBA,
  socials: [],
  formEndpoint: TBA,
  promises: [
    { icon: 'leaf', title: 'Made Fresh', text: 'Sweets prepared in small batches in our own kitchen.', confirmed: false },
    { icon: 'hands', title: 'Traditional Recipes', text: 'Classic mithai made the time-honoured way.', confirmed: false },
    { icon: 'gift', title: 'Gift Boxes', text: 'Beautifully packed boxes for every celebration.', confirmed: false },
    { icon: 'users', title: 'Catering & Events', text: 'Sweets and savouries for weddings, parties and offices.', confirmed: false },
  ],
};
