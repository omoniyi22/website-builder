import type { Block, BlockSettings } from '../../types/blocks';

const defaultSettings: BlockSettings = {
    width: 'normal',
    alignment: 'left',
    padding: 'normal'
};

export interface BlockCombination {
    id: string;
    name: string;
    description: string;
    category: string;
    previewImage?: string;
    blocks: Omit<Block, 'id'>[];
    tags?: string[];
}

export const blockCombinations: BlockCombination[] = [
    {
        id: 'hero-section',
        name: 'Hero Section',
        description: 'Full-width hero with image, heading, and call to action',
        category: 'Headers',
        tags: ['hero', 'header', 'banner', 'cta'],
        previewImage: `<svg>...</svg>`,
        blocks: [
            {
                type: 'image',
                content: {
                    url: '',
                    alt: 'Hero background',
                    aspectRatio: '21:9'
                },
                settings: {
                    width: 'full',
                    alignment: 'center',
                    padding: 'none'
                }
            },
            {
                type: 'text',
                content: {
                    text: 'Your Compelling Headline'
                },
                settings: {
                    width: 'wide',
                    alignment: 'center',
                    padding: 'large',
                    fontSize: 'large',
                    fontWeight: 'bold'
                }
            }
        ]
    },
    {
        id: 'features-grid',
        name: 'Features Grid',
        description: '3x2 grid of features with icons and descriptions',
        category: 'Features',
        tags: ['features', 'grid', 'benefits'],
        previewImage: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f3f4f6"/>
            <rect x="20" y="20" width="110" height="120" fill="#e5e7eb"/>
            <rect x="145" y="20" width="110" height="120" fill="#e5e7eb"/>
            <rect x="270" y="20" width="110" height="120" fill="#e5e7eb"/>
            <rect x="20" y="160" width="110" height="120" fill="#e5e7eb"/>
            <rect x="145" y="160" width="110" height="120" fill="#e5e7eb"/>
            <rect x="270" y="160" width="110" height="120" fill="#e5e7eb"/>
        </svg>`,
        blocks: [
            {
                type: 'columns',
                content: {
                    columns: Array(6).fill(null).map((_, i) => ({
                        id: `col${i + 1}`,
                        width: 0.33,
                        blocks: [
                            {
                                type: 'text',
                                content: `Feature ${i + 1}`,
                                settings: {
                                    alignment: 'center',
                                    padding: 'normal',
                                    fontSize: 'large'
                                }
                            },
                            {
                                type: 'text',
                                content: `Description of feature ${i + 1}`,
                                settings: {
                                    alignment: 'center',
                                    padding: 'small'
                                }
                            }
                        ]
                    }))
                },
                settings: {
                    width: 'wide',
                    padding: 'large'
                }
            }
        ]
    },
    {
        id: 'testimonials-carousel',
        name: 'Testimonials Carousel',
        description: 'Scrollable testimonials with images and quotes',
        category: 'Social Proof',
        tags: ['testimonials', 'reviews', 'quotes'],
        previewImage: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="200" fill="#f3f4f6"/>
            <circle cx="100" cy="60" r="30" fill="#d1d5db"/>
            <rect x="50" y="100" width="100" height="60" fill="#e5e7eb"/>
            <circle cx="200" cy="60" r="30" fill="#d1d5db"/>
            <rect x="150" y="100" width="100" height="60" fill="#e5e7eb"/>
            <circle cx="300" cy="60" r="30" fill="#d1d5db"/>
            <rect x="250" y="100" width="100" height="60" fill="#e5e7eb"/>
        </svg>`,
        blocks: [
            {
                type: 'gallery',
                content: {
                    layout: 'carousel',
                    images: Array(3).fill({
                        url: '',
                        alt: 'Testimonial',
                        caption: 'Customer testimonial here'
                    })
                },
                settings: {
                    width: 'wide',
                    padding: 'large'
                }
            }
        ]
    },
    // Add more combinations...
];

export const createBlocksFromCombination = (combinationId: string): Block[] => {
    const combination = blockCombinations.find(c => c.id === combinationId);
    if (!combination) return [];

    return combination.blocks.map(block => ({
        ...block,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
};

// Function to generate preview HTML for a combination
export const generateCombinationPreview = (combination: BlockCombination): string => {
    return combination.previewImage || `
        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="200" fill="#f3f4f6"/>
            <text x="200" y="100" text-anchor="middle" fill="#9ca3af">Preview not available</text>
        </svg>
    `;
};