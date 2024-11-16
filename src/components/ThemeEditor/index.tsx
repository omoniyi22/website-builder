import React, { useState } from 'react';
import { Theme } from '../../types';

interface ThemeEditorProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({
                                                     currentTheme,
                                                     onThemeChange
                                                 }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Theme Editor</h2>
            {/* Theme editing controls will go here */}
        </div>
    );
};

export { ThemeEditor };
export type { ThemeEditorProps };