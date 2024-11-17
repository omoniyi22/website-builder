import type { BlockType } from '../../types';

export const BLOCK_TYPES = {
    text: 'site-text-block',
    image: 'site-image-block',
    columns: 'site-columns-block',
    video: 'site-video-block',
    embed: 'site-embed-block',
    gallery: 'site-gallery-block',
    button: 'site-button-block',
    spacer: 'site-spacer-block',
    html: 'site-html-block',
    heading: 'site-heading-block',
    table: 'site-table-block',
    form: 'site-form-block'
} as const;

export type BlockTypeName = keyof typeof BLOCK_TYPES;