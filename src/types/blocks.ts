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
    type: BlockType;
    content: any;
    settings: BlockSettings;
}

export interface BlockSettings {
    width: 'full' | 'wide' | 'normal';
    alignment: 'left' | 'center' | 'right';
    padding: 'none' | 'small' | 'normal' | 'large';
}