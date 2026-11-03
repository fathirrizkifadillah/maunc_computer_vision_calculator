/**
 * Official MAUNC Visual Assets Manifest
 * Source: /elements/
 * Public mirror: /elements/
 */

export const ASSET_MANIFEST = {
  logo: '/elements/Logo MAUNC.png',
  mascot: '/elements/maunc_mascot_nobg.png',
  mascotHead: '/elements/maunc_mascot_head.png',
  mascotBody: '/elements/maunc_mascot_body.png',
  mascotTail: '/elements/maunc_mascot_tail.png',
  mascotOriginal: '/elements/maunc_mascot.jpg',
  horizontalLogo: '/elements/maunc_horizontal.png',
  designReference: '/elements/Web_design_example.png',
} as const;

export type AssetKey = keyof typeof ASSET_MANIFEST;
