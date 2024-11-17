export type BlockType =
    | 'text'
    | 'image'
    | 'columns'
    | 'table'
    | 'video'
    | 'form'
    | 'embed'
    | 'gallery'
    | 'button'
    | 'spacer'
    | 'html';

export interface Block {
    id: string;
    type: string;
    content: BlockContent;
    settings: BlockSettings;
}

export interface BlockSettings {
    width: 'full' | 'wide' | 'normal';
    alignment: 'left' | 'center' | 'right';
    padding: 'none' | 'small' | 'normal' | 'large';
    fontSize?: 'small' | 'normal' | 'large';
    fontWeight?: 'normal' | 'medium' | 'bold';
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'original';
    style?: {
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        border?: string;
    };
}

export interface BlockContent {
    text?: string;
    alt?: string;
    url?: string;
    aspectRatio?: string;
    width?: number;
    height?: number;
    focalPoint?: { x: number; y: number };
    columns?: Array<{
        id: string;
        width: number;
        blocks: Block[];
    }>;
}

export interface Column {
    id: string;
    width: number;
    blocks: Block[];
}

export const defaultBlockSettings: BlockSettings = {
    width: 'normal',
    alignment: 'left',
    padding: 'normal'
};