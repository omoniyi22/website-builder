import type { Block } from '../../types';

interface BlockTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'basic' | 'media' | 'layout' | 'advanced';
    defaultContent: Omit<Block, 'id'>;
}

export const blockTemplates: BlockTemplate[] = [
    {
        id: 'text-basic',
        name: 'Text',
        description: 'Basic text block for content',
        icon: 'type',
        category: 'basic',
        defaultContent: {
            type: 'text',
            content: '',
            settings: {
                width: 'normal',
                alignment: 'left',
                padding: 'normal',
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
            content: '',
            settings: {
                width: 'normal',
                alignment: 'left',
                padding: 'normal',
                fontSize: 'large',
                fontWeight: 'bold'
            }
        }
    },
    {
        id: 'image-basic',
        name: 'Image',
        description: 'Single responsive image',
        icon: 'image',
        category: 'media',
        defaultContent: {
            type: 'image',
            content: {
                url: '',
                alt: '',
                aspectRatio: '16:9',
                focalPoint: { x: 0.5, y: 0.5 }
            },
            settings: {
                width: 'normal',
                alignment: 'center',
                padding: 'normal'
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
                layout: 'grid',
                columns: 3
            },
            settings: {
                width: 'wide',
                padding: 'normal'
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
                width: 'normal',
                padding: 'normal'
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
                width: 'wide',
                padding: 'normal'
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
            content: '',
            settings: {
                width: 'normal',
                padding: 'normal'
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