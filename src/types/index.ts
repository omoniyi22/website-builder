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
    | 'html'
    | 'heading';

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

export interface Site {
    id: string;
    name: string;
    pages: Page[];
    theme: Theme;
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: Block[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    children: string[]; // Add this for nesting
    parentId: string | null; // Add this for nesting
    isDummy: boolean; // Add this for dummy pages
    showInNav: boolean; // Add this for nav visibility
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    customCSS?: string;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export interface ThemeFonts {
    heading: string;
    body: string;
}

export interface PageSettings {
    id: string;
    title: string;
    urlPrefix: string;
    showInNav: boolean;
    parentId: string | null;
    isDummy: boolean;
    order: number;
    children: string[];
    headerConfig: {
        enabled: boolean;
        height: number;
        backgroundImage?: string;
        backgroundColor?: string;
    };
    footerConfig: {
        enabled: boolean;
        content: string;
    };
}