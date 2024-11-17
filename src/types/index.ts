// Block Types
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

export interface BlockSettings {
    width: 'full' | 'wide' | 'normal';
    alignment: 'left' | 'center' | 'right';
    padding: 'none' | 'small' | 'normal' | 'large';
    fontSize?: 'small' | 'normal' | 'large';
    fontWeight?: 'normal' | 'medium' | 'bold';
    style?: {
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        border?: string;
    };
}

export type BlockSettingsUpdate = Partial<BlockSettings>;

export interface BlockContent {
    [key: string]: any;
}

export interface ColumnsBlockContent extends BlockContent {
    columns: Column[];
}

export interface Block {
    id: string;
    type: BlockType;
    content: BlockContent;
    settings: BlockSettings;
}

// Theme Types
export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: {
        primary: string;
        secondary: string;
        accent: string;
    };
    text: {
        primary: string;
        secondary: string;
        accent: string;
        inverse: string;
    };
}

export interface ThemeFonts {
    heading: string;
    body: string;
}

export interface Typography {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    fontFamily?: string;
    letterSpacing?: string;
}

export interface ThemeTypography {
    headings: {
        h1: Typography;
        h2: Typography;
        h3: Typography;
        h4: Typography;
    };
    body: Typography;
    accent: Typography;
}

export interface ThemeSpacing {
    content: {
        maxWidth: string;
        padding: string;
    };
    block: {
        padding: {
            small: string;
            medium: string;
            large: string;
        };
        margin: {
            small: string;
            medium: string;
            large: string;
        };
    };
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    customCSS?: string;
    typography?: ThemeTypography;
    spacing?: ThemeSpacing;
}

// Page Types
interface BasePageConfig {
    id: string;
    title: string;
    urlPrefix?: string;
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

export interface PageSettings extends BasePageConfig {
    urlPrefix: string;  // Required in PageSettings
}

export interface Page extends BasePageConfig {
    slug: string;
    content: Block[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    urlPrefix?: string;  // Optional in Page
}

export interface Column {
    id: string;
    width: number;
    blocks: Block[];
}

export interface Site {
    id: string;
    name: string;
    pages: Page[];
    theme: Theme;
}

export interface TextBlockSettings extends BlockSettings {
    fontSize: 'small' | 'normal' | 'large';
    fontWeight?: 'normal' | 'medium' | 'bold';
}

// Helper Functions
export function isPage(page: PageSettings | Page): page is Page {
    return 'content' in page && 'isPublished' in page;
}

export function pageSettingsToPage(settings: PageSettings): Omit<Page, 'content' | 'isPublished' | 'createdAt' | 'updatedAt'> {
    const { urlPrefix, ...rest } = settings;
    return {
        ...rest,
        slug: urlPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        urlPrefix: urlPrefix
    };
}

export interface TextBlockContent extends BlockContent {
    text: string;
    format: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
    };
}

export interface GalleryBlockContent extends BlockContent {
    images: Array<{
        url: string;
        alt: string;
        caption?: string;
        width: number;
        height: number;
    }>;
    layout: 'grid' | 'masonry' | 'carousel';
    columns: number;
}

export interface VideoBlockContent extends BlockContent {
    url: string;
    aspectRatio: '16:9' | '4:3' | '1:1';
    autoplay: boolean;
    controls: boolean;
}

export interface EmbedBlockContent extends BlockContent {
    html: string;
    originalContent?: string;
}

export interface ColumnsBlockContent extends BlockContent {
    columns: Array<{
        id: string;
        width: number;
        blocks: Block[];
    }>;
}

export interface BlockContent {
    text?: string;
    format?: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
    };
    html?: string;
    url?: string;
    images?: Array<{
        url: string;
        alt: string;
        caption?: string;
        width: number;
        height: number;
    }>;
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: Array<{
        id: string;
        width: number;
        blocks: Block[];
    }>;
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'original';
    autoplay?: boolean;
    controls?: boolean;
    originalContent?: string;
}

export function pageToPageSettings(page: Page): PageSettings {
    const {
        slug,
        content,
        isPublished,
        createdAt,
        updatedAt,
        ...settings
    } = page;
    return {
        ...settings,
        urlPrefix: page.urlPrefix || page.slug
    };
}