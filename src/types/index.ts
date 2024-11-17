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
}

export interface Block {
    id: string;
    type: BlockType; // Changed from string to BlockType
    content: any;
    settings: BlockSettings;
}

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

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    customCSS?: string;
    typography?: ThemeTypography;
    spacing?: ThemeSpacing;
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

export interface Typography {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    fontFamily?: string;
    letterSpacing?: string;
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

// Base interface for shared properties between Page and PageSettings
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

// PageSettings extends BasePageConfig
export interface PageSettings extends BasePageConfig {
    urlPrefix: string; // Required in PageSettings
}

// Page extends BasePageConfig with additional properties
export interface Page extends BasePageConfig {
    slug: string;
    content: Block[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    urlPrefix?: string; // Optional in Page
}

export interface Site {
    id: string;
    name: string;
    pages: Page[];
    theme: Theme;
}

// Type guard to check if a PageSettings is also a Page
export function isPage(page: PageSettings | Page): page is Page {
    return 'content' in page && 'isPublished' in page;
}

// Converter functions
export function pageSettingsToPage(settings: PageSettings): Omit<Page, 'content' | 'isPublished' | 'createdAt' | 'updatedAt'> {
    const { urlPrefix, ...rest } = settings;
    return {
        ...rest,
        slug: urlPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        urlPrefix: urlPrefix
    };
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