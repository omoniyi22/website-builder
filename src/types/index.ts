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
    | 'heading'
    | "a"
    | "div"
    | "span";

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
        margin?: string;
        marginTop?: string;
        marginRight?: string;
        marginBottom?: string;
        marginLeft?: string;
        boxShadow?: string;
        opacity?: number;
        transform?: string;
        zIndex?: number;
        display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'none';
        position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        width?: string;
        height?: string;
        maxWidth?: string;
        maxHeight?: string;
        overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        lineHeight?: string;
        letterSpacing?: string;
        fontFamily?: string;
        fontStyle?: 'normal' | 'italic' | 'oblique';
        fontVariant?: string;
        textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
        textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
        whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
        wordBreak?: 'normal' | 'break-word' | 'keep-all';
        direction?: 'ltr' | 'rtl';
        cursor?: 'auto' | 'default' | 'pointer' | 'move' | 'text' | 'wait' | 'help' | 'not-allowed';
        transition?: string;
        boxSizing?: 'content-box' | 'border-box';
        listStyleType?: 'disc' | 'circle' | 'square' | 'none';
        listStylePosition?: 'inside' | 'outside';
        visibility?: 'visible' | 'hidden';
        clip?: string;
        transformOrigin?: string;
        willChange?: string;
        filter?: string;
        backdropFilter?: string;
        objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
        objectPosition?: string;
        shapeOutside?: string;
        textOverflow?: 'clip' | 'ellipsis';
        alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
        justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
        alignSelf?: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch';
        flex?: string;
        flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
        flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
        alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch';
        gap?: string;
        gridTemplateColumns?: string;
        gridTemplateRows?: string;
        gridColumn?: string;
        gridRow?: string;
        gridTemplateAreas?: string;
        gridAutoColumns?: string;
        gridAutoRows?: string;
        gridAutoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
        gridColumnGap?: string;
        gridRowGap?: string;
        gridGap?: string;
        columnGap?: string;
        rowGap?: string;
        boxShadowInset?: string;
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
    className?: string,
    type: BlockType;
    text?: string;
    content: BlockContent;
    settings?: BlockSettings | any;
    children?: Block[]
    alt?: string;
    src?: string;
    onClick?: any
    editable?: boolean;
    //a
    href?: string;
    target?: string;
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
    pages: Page[];  // Make sure this is required, not optional
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
    columnCount: number;  // Renamed from 'columns' to avoid conflict
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