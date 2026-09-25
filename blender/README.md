# Gift-box renders (Blender)

`make_boxes.py` builds a gold Mithai Palace gift box in 3D: lid open, the logo and
the logo's Mughal arch inside the lid, four compartments. It fills the box with one
kind of mithai and renders it into `src/assets/photos/`, where the website picks it
up automatically (see the README in that folder for the file names).

These are 3D illustrations made for Mithai Palace, not photographs of the shop's
products. Replace them with real photos of your own boxes whenever you have them:
save the photo with the same file name.

## Run

From the project folder (Blender 5.1):

```bash
"C:/Program Files/Blender Foundation/Blender 5.1/blender.exe" -b --python blender/make_boxes.py
```

Options go after `--`:

```bash
blender -b --python blender/make_boxes.py -- sweet-kaju-katli hero --samples 64 --size 1000
```

- names: any of the keys in `RENDERS` (e.g. `sweet-gulab-jamun`, `category-ladoo`, `hero`, `gifting`); none means all
- `--samples`: Cycles samples (16 for a quick look, 64 for the site)
- `--size`: image height in pixels (square renders; `hero` and `gifting` are 1.6× wider)

A full run of all 23 images takes several minutes on this laptop.

## Changing things

- Sweet colours and textures: `make_materials()`
- Box colour: the `gold` material; the logo comes from `blender/logo-full.png`
- Which sweet goes in which image: the `RENDERS` table
- Lighting and backdrop: `stage()`
- Colour management uses **Standard**, not AgX: AgX shifted the orange ladoo towards pink.
