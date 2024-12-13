import React, { useState } from 'react';
import { Palette, Type, Layout, Grid } from 'lucide-react';
import { ColorSection } from './sections/ColorSection';
import { TypographySection } from './sections/TypographySection';
import { SpacingSection } from './sections/SpacingSection';
import { ComponentsSection } from './sections/ComponentsSection';
import type { Theme, ThemeTypography, ThemeSpacing } from '../../types';
import { defaultTheme } from './themeSystem';

interface ThemeEditorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
    currentTheme,
    onThemeChange
}) => {
    const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'components'>('colors');

    const tabs = [
        { id: 'colors', label: 'Colors', icon: Palette },
        { id: 'typography', label: 'Typography', icon: Type },
        { id: 'spacing', label: 'Spacing', icon: Layout },
        { id: 'components', label: 'Components', icon: Grid }
    ] as const;

    // Use default theme values if properties are undefined
    const typography: ThemeTypography = currentTheme.typography || defaultTheme.typography;
    const spacing: ThemeSpacing = currentTheme.spacing || defaultTheme.spacing;

    const renderContent = () => {
        switch (activeTab) {
            case 'colors':
                return (
                    <ColorSection
                        colors={currentTheme.colors}
                        onChange={(colors) => onThemeChange({ ...currentTheme, colors })}
                    />
                );
            case 'typography':
                return (
                    <TypographySection
                        typography={typography}
                        onChange={(newTypography) => onThemeChange({
                            ...currentTheme,
                            typography: newTypography
                        })}
                    />
                );
            case 'spacing':
                return (
                    <SpacingSection
                        spacing={spacing}
                        onChange={(newSpacing) => onThemeChange({
                            ...currentTheme,
                            spacing: newSpacing
                        })}
                    />
                );
            case 'components':
                return (
                    <ComponentsSection
                        theme={currentTheme}
                        onChange={(updates) => onThemeChange({ ...currentTheme, ...updates })}
                    />
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex p-2 space-x-1 border-b border-gray-200">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as typeof activeTab)}
                        className={`
                            flex items-center space-x-2 px-4 py-2 text-sm rounded-md flex-1
                            ${activeTab === id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-black">
                {renderContent()}
            </div>
        </div>
    );
};