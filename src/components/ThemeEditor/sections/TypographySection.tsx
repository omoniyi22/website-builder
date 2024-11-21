import React from 'react';
import type { Theme, ThemeTypography } from '../../../types';

// CSS Value Types
type CSSLength = string;
type CSSFontWeight = string | number;
type CSSLineHeight = string | number;
type CSSFontFamily = string;
type CSSLetterSpacing = string;

interface HeadingStyle {
    fontSize: CSSLength;
    fontWeight: CSSFontWeight;
    lineHeight: CSSLineHeight;
    fontFamily: CSSFontFamily;
    letterSpacing: CSSLetterSpacing | undefined;
}

interface BodyStyle {
    fontSize: CSSLength;
    fontWeight: CSSFontWeight;
    lineHeight: CSSLineHeight;
    fontFamily: CSSFontFamily;
}

interface FontFamilyOption {
    value: CSSFontFamily;
    label: string;
}

interface TypographySectionProps {
    typography: ThemeTypography;
    onChange: (typography: ThemeTypography) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
                                                                        typography,
                                                                        onChange
                                                                    }) => {
    const fontFamilyOptions: readonly FontFamilyOption[] = [
        { value: 'Arial, sans-serif', label: 'Arial' },
        { value: 'Roboto, sans-serif', label: 'Roboto' },
        { value: 'Inter, sans-serif', label: 'Inter' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: '"Times New Roman", serif', label: 'Times New Roman' },
        { value: 'system-ui, sans-serif', label: 'System Default' }
    ];

    const fontSizePresets: Record<keyof ThemeTypography['headings'] | 'body', CSSLength[]> = {
        h1: ['2rem', '2.25rem', '2.5rem', '3rem', '3.5rem'],
        h2: ['1.5rem', '1.75rem', '2rem', '2.25rem', '2.5rem'],
        h3: ['1.25rem', '1.5rem', '1.75rem', '2rem'],
        h4: ['1rem', '1.25rem', '1.5rem'],
        body: ['0.875rem', '1rem', '1.125rem']
    };

    const getHeadingStyle = (level: keyof ThemeTypography['headings']): HeadingStyle => {
        const style = typography.headings[level];
        return {
            fontSize: style.fontSize || '1rem',
            fontWeight: style.fontWeight || '400',
            lineHeight: style.lineHeight || '1.5',
            fontFamily: style.fontFamily || 'system-ui, sans-serif',
            letterSpacing: style.letterSpacing || undefined
        };
    };

    const getBodyStyle = (): BodyStyle => {
        const style = typography.body;
        return {
            fontSize: style.fontSize || '1rem',
            fontWeight: style.fontWeight || '400',
            lineHeight: style.lineHeight || '1.5',
            fontFamily: style.fontFamily || 'system-ui, sans-serif'
        };
    };

    // Style preview component with proper CSS types
    const StylePreview: React.FC<{
        style: HeadingStyle | BodyStyle;
        text: string;
    }> = ({ style, text }) => (
        <div
            style={{
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                letterSpacing: 'letterSpacing' in style ? style.letterSpacing : undefined,
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                marginTop: '0.5rem'
            }}
        >
            {text}
        </div>
    );

    const renderStylePreview = (level: keyof ThemeTypography['headings'] | 'body') => {
        const style = level === 'body' ? getBodyStyle() : getHeadingStyle(level as keyof ThemeTypography['headings']);
        const text = level === 'body'
            ? 'The quick brown fox jumps over the lazy dog'
            : `${level.toUpperCase()} Heading Preview`;

        return <StylePreview style={style} text={text} />;
    };

    const renderFontSelector = (
        level: keyof ThemeTypography['headings'] | 'body',
        style: HeadingStyle | BodyStyle,
        onFontChange: (value: CSSFontFamily) => void
    ) => (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Font</label>
            <div className="flex items-center space-x-2">
                <select
                    value={style.fontFamily}
                    onChange={(e) => onFontChange(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                >
                    {fontFamilyOptions.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                </select>
                <div
                    className="w-8 h-8 border rounded flex items-center justify-center"
                    style={{ fontFamily: style.fontFamily }}
                >
                    Aa
                </div>
            </div>
        </div>
    );

    const renderHeadingControls = (level: keyof ThemeTypography['headings']) => {
        const style = getHeadingStyle(level);

        return (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{level.toUpperCase()} Style</h4>
                    {renderStylePreview(level)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {renderFontSelector(
                        level,
                        style,
                        (value) => onChange({
                            ...typography,
                            headings: {
                                ...typography.headings,
                                [level]: {
                                    ...typography.headings[level],
                                    fontFamily: value
                                }
                            }
                        })
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Size</label>
                        <select
                            value={style.fontSize}
                            onChange={(e) => onChange({
                                ...typography,
                                headings: {
                                    ...typography.headings,
                                    [level]: {
                                        ...typography.headings[level],
                                        fontSize: e.target.value as CSSLength
                                    }
                                }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-1.5 text-sm"
                        >
                            {fontSizePresets[level].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 p-4">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Headings</h3>
                {renderHeadingControls('h1')}
                {renderHeadingControls('h2')}
                {renderHeadingControls('h3')}
                {renderHeadingControls('h4')}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Body Text</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                    {renderFontSelector(
                        'body',
                        getBodyStyle(),
                        (value) => onChange({
                            ...typography,
                            body: {
                                ...typography.body,
                                fontFamily: value
                            }
                        })
                    )}
                    {renderStylePreview('body')}
                </div>
            </div>
        </div>
    );
};