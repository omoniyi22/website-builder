import type { Block, BlockType, BlockSettings, BlockContent } from '../../types';

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

export const blockTemplates: BlockTemplate[] = [
    {
        id: 'text-basic',
        name: 'Text',
        description: 'Basic text block for content',
        icon: 'type',
        category: 'basic',
        defaultContent: {
            type: 'text',
            content: {
                text: '',
                format: {
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false
                }
            },
            settings: {
                ...defaultSettings,
                fontSize: 'normal'
            }
        }
    },
    {
        id: 'text-heading',
        name: 'Heading',
        description: 'Large text for sections',
        icon: 'heading',
        category: 'basic',
        defaultContent: {
            type: 'text',
            content: {
                text: '',
                format: {
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false
                }
            },
            settings: {
                ...defaultSettings,
                fontSize: 'large',
                fontWeight: 'bold'
            }
        }
    },
    {
        id: 'gallery-grid',
        name: 'Image Gallery',
        description: 'Grid of images',
        icon: 'grid',
        category: 'media',
        defaultContent: {
            type: 'gallery',
            content: {
                images: [],
                layout: 'grid' as const,
                columns: 3
            },
            settings: {
                ...defaultSettings,
                width: 'wide'
            }
        }
    },
    {
        id: 'video-youtube',
        name: 'Video',
        description: 'Embed video content',
        icon: 'video',
        category: 'media',
        defaultContent: {
            type: 'video',
            content: {
                url: '',
                aspectRatio: '16:9',
                autoplay: false,
                controls: true
            },
            settings: {
                ...defaultSettings,
                width: 'normal'
            }
        }
    },
    {
        id: 'columns-2',
        name: '2 Columns',
        description: 'Two column layout',
        icon: 'columns',
        category: 'layout',
        defaultContent: {
            type: 'columns',
            content: {
                columns: [
                    { id: '1', width: 0.5, blocks: [] },
                    { id: '2', width: 0.5, blocks: [] }
                ]
            },
            settings: {
                ...defaultSettings,
                width: 'wide'
            }
        }
    },
    {
        id: 'embed-html',
        name: 'HTML Embed',
        description: 'Custom HTML content',
        icon: 'code',
        category: 'advanced',
        defaultContent: {
            type: 'embed',
            content: {
                html: '',
                originalContent: ''
            },
            settings: {
                ...defaultSettings,
                width: 'normal'
            }
        }
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