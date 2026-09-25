"""
Mithai Palace gift-box renders.

Builds a gold gift box (lid open, Mithai Palace logo inside the lid, four
compartments) filled with one kind of mithai, and renders it for the website.

Run from the project root:
    blender -b --python blender/make_boxes.py -- [names...] [--samples N] [--size PX]

With no names it renders everything in RENDERS. Output goes to
src/assets/photos/<name>.jpg, which the site picks up automatically.
"""
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, 'src', 'assets', 'photos')
LOGO = os.path.join(HERE, 'logo-full.png')

# Box dimensions (metres)
BOX_W, BOX_D, BOX_H = 0.30, 0.22, 0.05
WALL = 0.006
DIVIDER = 0.003
LID_ANGLE = -102  # degrees; lid leans slightly back


# ── helpers ────────────────────────────────────────────────────────────────

def hex_rgb(h, a=1.0):
    h = h.lstrip('#')
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    random.seed(7)


def link(obj, coll=None):
    (coll or bpy.context.scene.collection).objects.link(obj)
    return obj


def box_mesh(name, sx, sy, sz, bevel=0.0008):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    if bevel:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel, segments=2, affect='EDGES')
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def cube_obj(name, size, loc, mat, parent=None, bevel=0.0008, coll=None):
    ob = link(bpy.data.objects.new(name, box_mesh(name, *size, bevel=bevel)), coll)
    ob.location = loc
    ob.data.materials.append(mat)
    if parent:
        ob.parent = parent
    return ob


def principled(name, color, rough=0.5, metal=0.0, sss=0.0, coat=0.0, sheen=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hex_rgb(color) if isinstance(color, str) else color
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (0.004, 0.002, 0.001)
    if coat:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = 0.08
    if sheen:
        b.inputs['Sheen Weight'].default_value = sheen
    return m


def add_bump(mat, scale=400.0, strength=0.25, detail=6.0, kind='NOISE'):
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexNoise' if kind == 'NOISE' else 'ShaderNodeTexVoronoi')
    tex.inputs['Scale'].default_value = scale
    if kind == 'NOISE':
        tex.inputs['Detail'].default_value = detail
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    out = tex.outputs['Fac'] if kind == 'NOISE' else tex.outputs['Distance']
    nt.links.new(out, bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return mat


# ── materials ──────────────────────────────────────────────────────────────

def make_materials():
    M = {}
    M['gold'] = add_bump(principled('Gold card', '#C9973F', rough=0.38, metal=0.9), scale=900, strength=0.08)
    M['gold_dark'] = principled('Gold line', '#B8893F', rough=0.3, metal=0.95)
    M['backdrop'] = principled('Backdrop', '#CF9585', rough=0.9)
    M['liner'] = principled('Liner', '#E9D3A8', rough=0.55, metal=0.4)
    M['pista'] = add_bump(principled('Pistachio', '#7FA33A', rough=0.55, sss=0.1), scale=300, strength=0.3)
    M['almond'] = principled('Almond', '#C9A57A', rough=0.5)
    M['cashew'] = principled('Cashew bit', '#E6CFA0', rough=0.5)

    # Kaju katli: off-white with crinkled silver leaf patches
    kk = bpy.data.materials.new('Kaju katli')
    kk.use_nodes = True
    nt = kk.node_tree
    out = nt.nodes['Material Output']
    base = nt.nodes['Principled BSDF']
    base.inputs['Base Color'].default_value = hex_rgb('#E6D6B4')
    base.inputs['Roughness'].default_value = 0.6
    base.inputs['Subsurface Weight'].default_value = 0.15
    silver = nt.nodes.new('ShaderNodeBsdfPrincipled')
    silver.inputs['Base Color'].default_value = hex_rgb('#C9CACD')
    silver.inputs['Metallic'].default_value = 1.0
    silver.inputs['Roughness'].default_value = 0.22
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 60
    noise.inputs['Detail'].default_value = 8
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.36
    ramp.color_ramp.elements[1].position = 0.40
    crinkle = nt.nodes.new('ShaderNodeTexVoronoi')
    crinkle.inputs['Scale'].default_value = 250
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.18
    mix = nt.nodes.new('ShaderNodeMixShader')
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    mul = nt.nodes.new('ShaderNodeMath')
    mul.operation = 'MULTIPLY'
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    # silver only on upward-facing surfaces
    nt.links.new(geo.outputs['Normal'], sep.inputs['Vector'])
    nt.links.new(ramp.outputs['Color'], mul.inputs[0])
    nt.links.new(sep.outputs['Z'], mul.inputs[1])
    nt.links.new(mul.outputs['Value'], mix.inputs['Fac'])
    nt.links.new(crinkle.outputs['Distance'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], silver.inputs['Normal'])
    nt.links.new(base.outputs['BSDF'], mix.inputs[1])
    nt.links.new(silver.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    M['kaju'] = kk

    M['barfi_milk'] = add_bump(principled('Milk barfi', '#F1E3BE', rough=0.7, sss=0.2), scale=250, strength=0.2)
    M['barfi_pista'] = add_bump(principled('Pista barfi', '#7E9A45', rough=0.7, sss=0.06), scale=250, strength=0.2)
    M['barfi_coconut'] = add_bump(principled('Coconut barfi', '#F6F0E2', rough=0.8, sss=0.2), scale=900, strength=0.5, kind='VORONOI')
    M['barfi_besan'] = add_bump(principled('Besan barfi', '#C98A25', rough=0.7, sss=0.06), scale=300, strength=0.35)
    M['kalakand'] = add_bump(principled('Kalakand', '#EFDDB0', rough=0.75, sss=0.2), scale=500, strength=0.5, kind='VORONOI')
    M['milk_cake'] = add_bump(principled('Milk cake', '#9C5A22', rough=0.7, sss=0.06), scale=200, strength=0.5)
    M['motichoor'] = add_bump(principled('Motichoor', '#E35A00', rough=0.5, sss=0.08, coat=0.15), scale=900, strength=0.9, kind='VORONOI')
    M['besan_ladoo'] = add_bump(principled('Besan ladoo', '#C98A1E', rough=0.75, sss=0.06), scale=500, strength=0.4)
    M['coconut_ladoo'] = add_bump(principled('Coconut ladoo', '#F7F1E6', rough=0.85, sss=0.2), scale=700, strength=0.7, kind='VORONOI')
    M['dryfruit_ladoo'] = add_bump(principled('Dry fruit ladoo', '#6E4326', rough=0.55, sss=0.1), scale=180, strength=0.6, kind='VORONOI')
    M['gulab_jamun'] = add_bump(principled('Gulab jamun', '#3A1407', rough=0.5, sss=0.05, coat=0.15), scale=120, strength=0.1)
    M['rasgulla'] = add_bump(principled('Rasgulla', '#E9E1CF', rough=0.45, sss=0.3, coat=0.25), scale=300, strength=0.25)
    M['rasmalai'] = add_bump(principled('Rasmalai', '#F4E7C4', rough=0.35, sss=0.4, coat=0.3), scale=300, strength=0.15)
    M['rabri'] = principled('Saffron milk', '#EFC15A', rough=0.15, sss=0.3, coat=0.5)
    M['halwa_gajar'] = add_bump(principled('Gajar halwa', '#B8300A', rough=0.7, sss=0.04), scale=260, strength=1.0, kind='VORONOI')
    M['halwa_moong'] = add_bump(principled('Moong dal halwa', '#B97A22', rough=0.7, sss=0.04), scale=320, strength=0.9, kind='VORONOI')
    M['halwa_sooji'] = add_bump(principled('Sooji halwa', '#D6A240', rough=0.75, sss=0.04), scale=600, strength=0.6)
    M['cup'] = principled('Gold cup', '#D2AA60', rough=0.3, metal=1.0)
    M['raisin'] = principled('Raisin', '#5A2E1A', rough=0.4)
    return M


# ── the box ────────────────────────────────────────────────────────────────

ARCH = [(0, 120), (0, 56), (0, 48, 5, 44, 11, 44), (11, 36, 17, 30, 25, 30), (27, 19, 38, 11, 50, 0),
        (62, 11, 73, 19, 75, 30), (83, 30, 89, 36, 89, 44), (95, 44, 100, 48, 100, 56), (100, 120)]


def arch_curve(name, width, height, mat, parent, depth):
    """Raised gold arch outline (the logo's Mughal arch) on the inside of the lid."""
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.0009
    cu.bevel_resolution = 2
    sp = cu.splines.new('BEZIER')
    pts = []
    x0, y0 = ARCH[0][0], ARCH[0][1]
    pts.append(((x0, y0), (x0, y0), (x0, y0)))
    cur = (x0, y0)
    for seg in ARCH[1:]:
        if len(seg) == 2:
            pts.append((seg, seg, seg))
            cur = seg
        else:
            c1, c2, end = seg[0:2], seg[2:4], seg[4:6]
            # attach c1 as the previous point's right handle
            prev = pts[-1]
            pts[-1] = (prev[0], prev[1], c1)
            pts.append((end, c2, end))
            cur = end
    sp.bezier_points.add(len(pts) - 1)
    for bp, (co, hl, hr) in zip(sp.bezier_points, pts):
        def m(p):
            # arch space (0..100 x 0..120, y down) -> lid space (x across, y toward front edge)
            return Vector(((p[0] / 100 - 0.5) * width, -(0.5 - p[1] / 120) * height, 0))
        bp.co = m(co)
        bp.handle_left = m(hl)
        bp.handle_right = m(hr)
        bp.handle_left_type = bp.handle_right_type = 'FREE'
    ob = link(bpy.data.objects.new(name, cu))
    ob.data.materials.append(mat)
    ob.parent = parent
    ob.location = (0, 0, depth)
    return ob


def logo_plane(parent, depth, size_h):
    img = bpy.data.images.load(LOGO)
    w = size_h * img.size[0] / img.size[1]
    me = bpy.data.meshes.new('Logo')
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    vs = [bm.verts.new((x * w / 2, y * size_h / 2, 0)) for x, y in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    f = bm.faces.new(vs)
    for loop, (u, v) in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
        loop[uv].uv = (u, v)
    bm.to_mesh(me)
    bm.free()
    mat = bpy.data.materials.new('Logo print')
    mat.use_nodes = True
    mat.blend_method = 'HASHED' if hasattr(mat, 'blend_method') else None
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    tex.interpolation = 'Cubic'
    b.inputs['Roughness'].default_value = 0.5
    b.inputs['Metallic'].default_value = 0.0
    nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(tex.outputs['Alpha'], b.inputs['Alpha'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.4
    nt.links.new(tex.outputs['Alpha'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    me.materials.append(mat)
    ob = link(bpy.data.objects.new('Logo', me))
    ob.parent = parent
    ob.location = (0, 0, depth)
    ob.rotation_euler = (math.pi, 0, 0)  # face the inside of the lid; image top toward the lid's front edge
    return ob


def build_box(M):
    g = M['gold']
    base = bpy.data.objects.new('Box', None)
    link(base)
    t = WALL
    cube_obj('Bottom', (BOX_W, BOX_D, t), (0, 0, t / 2), g, base)
    cube_obj('Wall front', (BOX_W, t, BOX_H), (0, -BOX_D / 2 + t / 2, BOX_H / 2), g, base)
    cube_obj('Wall back', (BOX_W, t, BOX_H), (0, BOX_D / 2 - t / 2, BOX_H / 2), g, base)
    cube_obj('Wall left', (t, BOX_D, BOX_H), (-BOX_W / 2 + t / 2, 0, BOX_H / 2), g, base)
    cube_obj('Wall right', (t, BOX_D, BOX_H), (BOX_W / 2 - t / 2, 0, BOX_H / 2), g, base)
    inner_w = BOX_W - 2 * t
    col_w = (inner_w - 3 * DIVIDER) / 4
    centres = []
    for i in range(4):
        cx = -inner_w / 2 + col_w / 2 + i * (col_w + DIVIDER)
        centres.append(cx)
        if i < 3:
            cube_obj(f'Divider {i}', (DIVIDER, BOX_D - 2 * t, BOX_H * 0.8),
                     (cx + col_w / 2 + DIVIDER / 2, 0, BOX_H * 0.4), g, base)
    # Lid: hinged on the back top edge
    hinge = bpy.data.objects.new('Lid hinge', None)
    link(hinge)
    hinge.location = (0, BOX_D / 2, BOX_H)
    hinge.rotation_euler = (math.radians(LID_ANGLE), 0, 0)
    lid_t = 0.004
    lid = cube_obj('Lid', (BOX_W + 0.004, BOX_D + 0.004, lid_t), (0, -BOX_D / 2, 0), g, hinge)
    rim_h = 0.022
    cube_obj('Lid rim front', (BOX_W + 0.004, lid_t, rim_h), (0, -BOX_D - 0.002 + lid_t / 2, -rim_h / 2), g, hinge)
    cube_obj('Lid rim left', (lid_t, BOX_D + 0.004, rim_h), (-BOX_W / 2 - 0.002 + lid_t / 2, -BOX_D / 2, -rim_h / 2), g, hinge)
    cube_obj('Lid rim right', (lid_t, BOX_D + 0.004, rim_h), (BOX_W / 2 + 0.002 - lid_t / 2, -BOX_D / 2, -rim_h / 2), g, hinge)
    inner = -lid_t / 2 - 0.0004
    arch_curve('Lid arch', 0.20, 0.185, M['gold_dark'], lid, inner)
    logo_plane(lid, inner - 0.0002, 0.135)
    return centres, col_w, BOX_D - 2 * t


# ── sweets ─────────────────────────────────────────────────────────────────

def sphere_mesh(name, r, rings=24, segs=48):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=r)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def piece(name, me, mat, loc, rot_z=None, scale=(1, 1, 1)):
    ob = link(bpy.data.objects.new(name, me))
    if not ob.data.materials:
        ob.data.materials.append(mat)
    ob.location = loc
    ob.rotation_euler = (0, 0, rot_z if rot_z is not None else random.uniform(0, math.tau))
    ob.scale = scale
    return ob


def garnish(top_z, cx, cy, spread, mat, count=4, size=(0.006, 0.0035, 0.0012)):
    me = box_mesh('sliver', *size, bevel=0.0004)
    me.materials.append(mat)
    for _ in range(count):
        ob = link(bpy.data.objects.new('Garnish', me))
        ob.location = (cx + random.uniform(-spread, spread), cy + random.uniform(-spread, spread), top_z + size[2] / 2)
        ob.rotation_euler = (random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3), random.uniform(0, math.tau))


def grid(centres, col_h, rows):
    step = col_h / rows
    for cx in centres:
        for r in range(rows):
            yield cx, -col_h / 2 + step / 2 + r * step


def fill_barfi(M, centres, col_w, col_h, mat, garnish_mat='pista', h=0.02, cols=None):
    cols = cols or centres
    w = min(col_w - 0.008, 0.052)
    me = box_mesh('Barfi', w, w * 0.9, h, bevel=0.0015)
    me.materials.append(mat)
    for cx, cy in grid(cols, col_h, 4):
        piece('Barfi', me, mat, (cx, cy, WALL + h / 2), rot_z=random.uniform(-0.04, 0.04))
        if garnish_mat:
            garnish(WALL + h, cx, cy, w * 0.25, M[garnish_mat], count=random.randint(3, 5))


def fill_kaju(M, centres, col_w, col_h, cols=None):
    cols = cols or centres
    me = bpy.data.meshes.new('Kaju katli')
    bm = bmesh.new()
    a, b, h = (col_w - 0.008) / 2, 0.042 / 2, 0.009
    ring = [(a, 0), (0, b), (-a, 0), (0, -b)]
    bot = [bm.verts.new((x, y, 0)) for x, y in ring]
    top = [bm.verts.new((x, y, h)) for x, y in ring]
    bm.faces.new(bot[::-1])
    bm.faces.new(top)
    for i in range(4):
        bm.faces.new((bot[i], bot[(i + 1) % 4], top[(i + 1) % 4], top[i]))
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=0.0008, segments=2, affect='EDGES')
    bm.to_mesh(me)
    bm.free()
    me.materials.append(M['kaju'])
    for cx, cy in grid(cols, col_h, 4):
        piece('Kaju', me, M['kaju'], (cx, cy, WALL), rot_z=random.uniform(-0.05, 0.05))


def fill_balls(M, centres, col_w, col_h, mat, r=0.021, grainy=0.0, squash=1.0, rows=4, top=None, cols=None):
    cols = cols or centres
    me = sphere_mesh('Ball', r, rings=48 if grainy else 24, segs=96 if grainy else 48)
    me.materials.append(mat)
    tex = None
    if grainy:
        tex = bpy.data.textures.new('grain', 'VORONOI')
        tex.noise_scale = grainy
    for cx, cy in grid(cols, col_h, rows):
        ob = piece('Ball', me, mat, (cx, cy, WALL + r * squash), scale=(1, 1, squash))
        if tex:
            d = ob.modifiers.new('Grain', 'DISPLACE')
            d.texture = tex
            d.strength = r * 0.08
            d.texture_coords = 'OBJECT'
        if top:
            garnish(WALL + 2 * r * squash - 0.001, cx, cy, 0.002, M[top], count=1, size=(0.005, 0.003, 0.0015))


def cups(M, centres, col_h, fill_mat, rows=3, r=0.03, mound=True, pieces=None):
    cup_me = bpy.data.meshes.new('Cup')
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=r * 0.8, radius2=r, depth=0.028)
    bm.to_mesh(cup_me)
    bm.free()
    cup_me.materials.append(M['cup'])
    sol = cup_me.polygons  # noqa: keep mesh simple
    for cx, cy in grid(centres, col_h, rows):
        cup = piece('Cup', cup_me, M['cup'], (cx, cy, WALL + 0.014), rot_z=0)
        s = cup.modifiers.new('Hollow', 'SOLIDIFY')
        s.thickness = 0.0012
        # the food inside
        fill = link(bpy.data.objects.new('Fill', sphere_mesh('Fill', r * 0.94, rings=32, segs=64)))
        fill.data.materials.append(fill_mat)
        fill.location = (cx, cy, WALL + 0.022)
        fill.scale = (1, 1, 0.42 if mound else 0.18)
        if pieces:
            pieces(cx, cy, WALL + 0.028)


# ── what each render contains ──────────────────────────────────────────────

def recipe_single(kind):
    def build(M, centres, col_w, col_h):
        kind(M, centres, col_w, col_h)
    return build


def rasmalai_disc(M):
    def put(cx, cy, z):
        disc = link(bpy.data.objects.new('Rasmalai', sphere_mesh('Rasmalai', 0.02, rings=24, segs=48)))
        disc.data.materials.append(M['rasmalai'])
        disc.location = (cx, cy, z - 0.004)
        disc.scale = (1, 1, 0.38)
        garnish(z + 0.002, cx, cy, 0.008, M['pista'], count=3, size=(0.005, 0.003, 0.0012))
    return put


def nuts_on(M, mat_key, n=4):
    def put(cx, cy, z):
        garnish(z, cx, cy, 0.012, M[mat_key], count=n, size=(0.007, 0.004, 0.0015))
    return put


RENDERS = {
    'sweet-kaju-katli': lambda M, c, w, h: fill_kaju(M, c, w, h),
    'sweet-plain-milk-barfi': lambda M, c, w, h: fill_barfi(M, c, w, h, M['barfi_milk'], 'pista'),
    'sweet-pista-barfi': lambda M, c, w, h: fill_barfi(M, c, w, h, M['barfi_pista'], 'pista'),
    'sweet-coconut-barfi': lambda M, c, w, h: fill_barfi(M, c, w, h, M['barfi_coconut'], None),
    'sweet-besan-barfi': lambda M, c, w, h: fill_barfi(M, c, w, h, M['barfi_besan'], 'almond'),
    'sweet-kalakand': lambda M, c, w, h: fill_barfi(M, c, w, h, M['kalakand'], 'pista', h=0.024),
    'sweet-milk-cake': lambda M, c, w, h: fill_barfi(M, c, w, h, M['milk_cake'], None, h=0.026),
    'sweet-motichoor-ladoo': lambda M, c, w, h: fill_balls(M, c, w, h, M['motichoor'], grainy=0.0025, top='pista'),
    'sweet-besan-ladoo': lambda M, c, w, h: fill_balls(M, c, w, h, M['besan_ladoo'], grainy=0.004, top='almond'),
    'sweet-coconut-ladoo': lambda M, c, w, h: fill_balls(M, c, w, h, M['coconut_ladoo'], grainy=0.002),
    'sweet-dry-fruit-ladoo': lambda M, c, w, h: fill_balls(M, c, w, h, M['dryfruit_ladoo'], grainy=0.006),
    'sweet-gulab-jamun': lambda M, c, w, h: fill_balls(M, c, w, h, M['gulab_jamun'], r=0.02, squash=0.9),
    'sweet-rasgulla': lambda M, c, w, h: fill_balls(M, c, w, h, M['rasgulla'], r=0.021),
    'sweet-rasmalai': lambda M, c, w, h: cups(M, c, h, M['rabri'], mound=False, pieces=rasmalai_disc(M)),
    'sweet-gajar-halwa': lambda M, c, w, h: cups(M, c, h, M['halwa_gajar'], pieces=nuts_on(M, 'cashew', 3)),
    'sweet-moong-dal-halwa': lambda M, c, w, h: cups(M, c, h, M['halwa_moong'], pieces=nuts_on(M, 'almond', 3)),
    'sweet-sooji-halwa': lambda M, c, w, h: cups(M, c, h, M['halwa_sooji'], pieces=nuts_on(M, 'raisin', 4)),
}


def assorted(M, c, w, h):
    """Like the owner's reference box: ladoo, pista barfi, milk barfi, kaju katli."""
    fill_balls(M, c, w, h, M['motichoor'], grainy=0.0025, top='pista', cols=[c[0]])
    fill_barfi(M, c, w, h, M['barfi_pista'], 'pista', cols=[c[1]])
    fill_barfi(M, c, w, h, M['barfi_milk'], 'pista', cols=[c[2]])
    fill_kaju(M, c, w, h, cols=[c[3]])


WIDE = {'hero', 'gifting'}
RENDERS.update({'hero': assorted, 'gifting': assorted,
                'category-barfi': RENDERS['sweet-pista-barfi'], 'category-ladoo': RENDERS['sweet-motichoor-ladoo'],
                'category-halwa': RENDERS['sweet-gajar-halwa'], 'category-milk-sweets': RENDERS['sweet-gulab-jamun']})


# ── stage, camera, render ──────────────────────────────────────────────────

def stage(M, name):
    # seamless blush sweep
    me = bpy.data.meshes.new('Sweep')
    bm = bmesh.new()
    prof = [(-1.5, y, 0) for y in (-1.5,)]
    verts = []
    for i in range(25):
        t = i / 24
        a = t * math.pi / 2
        y = 0.35 + 0.25 * math.sin(a) if t > 0 else -1.5
        z = 0.25 - 0.25 * math.cos(a)
        verts.append((y, z))
    verts = [(-1.5, 0.0)] + [(0.35 + 0.25 * math.sin(i / 24 * math.pi / 2), 0.25 - 0.25 * math.cos(i / 24 * math.pi / 2)) for i in range(25)] + [(0.6, 1.5)]
    rows = []
    for x in (-2.0, 2.0):
        rows.append([bm.verts.new((x, y, z)) for y, z in verts])
    for i in range(len(verts) - 1):
        bm.faces.new((rows[0][i], rows[1][i], rows[1][i + 1], rows[0][i + 1]))
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    sweep = link(bpy.data.objects.new('Sweep', me))
    sweep.data.materials.append(M['backdrop'])

    def area(nm, loc, rot, size, energy, color=(1, 0.97, 0.92)):
        l = bpy.data.lights.new(nm, 'AREA')
        l.size = size
        l.energy = energy
        l.color = color
        ob = link(bpy.data.objects.new(nm, l))
        ob.location = loc
        ob.rotation_euler = [math.radians(a) for a in rot]
    area('Key', (-0.45, -0.55, 0.75), (48, 0, -38), 0.7, 45, (1, 1, 1))
    area('Fill', (0.6, -0.45, 0.35), (70, 0, 55), 1.0, 14, (1, 0.93, 0.9))
    area('Top', (0, 0.1, 0.9), (0, 0, 0), 0.5, 18)

    world = bpy.data.worlds.new('World')
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = hex_rgb('#FFFFFF')
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
    bpy.context.scene.world = world

    cam_data = bpy.data.cameras.new('Cam')
    cam = link(bpy.data.objects.new('Cam', cam_data))
    wide = name in WIDE
    if wide:
        cam_data.lens = 50
        cam.location = (-0.18, -0.78, 0.58)
        # hero: box sits right of centre, leaving room for the headline on the left
        target = Vector((-0.19 if name == 'hero' else 0.0, 0.03, 0.07))
    else:
        cam_data.lens = 50
        cam.location = (0, -0.38, 0.56)
        target = Vector((0, 0.035, 0.06))
    d = target - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cam_data.dof.use_dof = True
    cam_data.dof.focus_distance = d.length
    cam_data.dof.aperture_fstop = 5.6
    bpy.context.scene.camera = cam
    return wide


def render(name, samples, size):
    reset()
    M = make_materials()
    centres, col_w, col_h = build_box(M)
    RENDERS[name](M, centres, col_w, col_h)
    wide = stage(M, name)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    # 'Standard' keeps food colours true (AgX shifted orange ladoo towards pink)
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = -1.1
    sc.render.resolution_x = int(size * (1.6 if wide else 1))
    sc.render.resolution_y = size
    sc.render.image_settings.file_format = 'JPEG'
    sc.render.image_settings.quality = 88
    os.makedirs(OUT_DIR, exist_ok=True)
    sc.render.filepath = os.path.join(OUT_DIR, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', sc.render.filepath)


def main():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    samples, size, names = 96, 1200, []
    i = 0
    while i < len(argv):
        if argv[i] == '--samples':
            samples = int(argv[i + 1]); i += 2
        elif argv[i] == '--size':
            size = int(argv[i + 1]); i += 2
        else:
            names.append(argv[i]); i += 1
    for n in names or list(RENDERS):
        render(n, samples, size)


main()
