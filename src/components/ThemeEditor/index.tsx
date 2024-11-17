import React, { useState } from 'react';
import { Palette, Type, Layout, Grid, Sliders } from 'lucide-react';
import { ColorSection } from './sections/ColorSection';
import { TypographySection } from './sections/TypographySection';
import { SpacingSection } from './sections/SpacingSection';
import { ComponentsSection } from './sections/ComponentsSection';
import type { Theme } from '../../types';

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
                        typography={currentTheme.typography}
                        onChange={(typography) => onThemeChange({ ...currentTheme, typography })}
                    />
                );
            case 'spacing':
                return (
                    <SpacingSection
                        spacing={currentTheme.spacing}
                        onChange={(spacing) => onThemeChange({ ...currentTheme, spacing })}
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
            {/* Tabs */}
            <div className="flex p-2 space-x-1 border-b border-gray-200">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {renderContent()}
            </div>
        </div>
    );
};