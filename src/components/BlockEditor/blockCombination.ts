import type { Block, BlockSettings, BlockContent } from '../../types';
import {blockTemplates} from "@/components/BlockEditor/blockTemplates";

interface BlockTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'basic' | 'media' | 'layout' | 'advanced';
    defaultContent: Omit<Block, 'id'>;
}

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
        id: 'features-grid',
        name: 'Features Grid',
        description: '3x2 grid of features with icons and descriptions',
        category: 'Features',
        tags: ['features', 'grid', 'benefits'],
        previewImage: `<svg>...</svg>`,
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
                                content: {
                                    text: `Feature ${i + 1}`,
                                    format: {
                                        bold: false,
                                        italic: false,
                                        underline: false,
                                        strikethrough: false
                                    }
                                },
                                settings: {
                                    ...defaultSettings,
                                    alignment: 'center',
                                    padding: 'normal',
                                    fontSize: 'large'
                                }
                            },
                            {
                                type: 'text',
                                content: {
                                    text: `Description of feature ${i + 1}`,
                                    format: {
                                        bold: false,
                                        italic: false,
                                        underline: false,
                                        strikethrough: false
                                    }
                                },
                                settings: {
                                    ...defaultSettings,
                                    alignment: 'center',
                                    padding: 'small'
                                }
                            }
                        ]
                    }))
                },
                settings: {
                    ...defaultSettings,
                    width: 'wide',
                    alignment: 'center',
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
        blocks: [
            {
                type: 'gallery',
                content: {
                    images: Array(3).fill({
                        url: '',
                        alt: 'Testimonial',
                        caption: 'Customer testimonial here',
                        width: 300,
                        height: 200
                    }),
                    galleryType: 'carousel',
                    columns: 3
                },
                settings: {
                    ...defaultSettings,
                    width: 'wide',
                    alignment: 'center',
                    padding: 'large'
                }
            }
        ]
    }
];

export const createBlockFromTemplate = (templateId: string): Block => {
    const template = blockTemplates.find(t => t.id === templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    return {
        id: Date.now().toString(),
        ...template.defaultContent
    };
};

export const createBlocksFromCombination = (combinationId: string): Block[] => {
    const combination = blockCombinations.find(c => c.id === combinationId);
    if (!combination) return [];

    return combination.blocks.map(block => ({
        ...block,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    }));
};