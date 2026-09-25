/**
 * Photos dropped into src/assets/photos/ are picked up by file name
 * (see the README in that folder). Missing photos fall back to stand-ins.
 */
const files = import.meta.glob<{ default: { src: string; width: number; height: number } }>(
  '../assets/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const byName = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase(), mod.default]),
);

export const slug = (name: string): string =>
  name.trim().toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Photo = { src: string; width: number; height: number };

export const findPhoto = (name: string): Photo | undefined => byName.get(name.toLowerCase());
