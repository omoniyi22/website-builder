export * from './TextBlock';
export * from './ImageBlock';
export * from './ColumnsBlock';

// Register all blocks for use
const BLOCK_TYPES = {
    text: 'site-text-block',
    image: 'site-image-block',
    columns: 'site-columns-block'
} as const;

export { BLOCK_TYPES };