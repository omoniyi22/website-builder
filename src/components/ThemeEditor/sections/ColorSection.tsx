import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { ThemeColors } from '../../../types';

interface ColorSectionProps {
    colors: ThemeColors;
    onChange: (colors: ThemeColors) => void;
}

export const ColorSection: React.FC<ColorSectionProps> = ({ colors, onChange }) => {
    const [activeColor, setActiveColor] = useState<string | null>(null);

    const updateColor = (key: string, value: string) => {
        onChange({
            ...colors,
            [key]: value
        });
    };

    const renderColorPicker = (colorKey: string, value: string) => (
        <div className="relative group">
            <div className="flex items-center space-x-2">
                <div
                    className="w-10 h-10 rounded shadow cursor-pointer border"
                    style={{ backgroundColor: value }}
                    onClick={() => setActiveColor(activeColor === colorKey ? null : colorKey)}
                />
                <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                        {colorKey.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateColor(colorKey, e.target.value)}
                        className="w-full mt-1 px-2 py-1 text-sm border rounded"
                    />
                </div>
            </div>

            {activeColor === colorKey && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg z-10">
                    <div className="mb-4">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => updateColor(colorKey, e.target.value)}
                            className="w-full h-32 rounded cursor-pointer"
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {/* Quick color palette */}
                        {[
                            '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA',
                            '#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
                            '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA',
                            '#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B',
                            '#18181B', '#27272A', '#3F3F46', '#52525B', '#71717A'
                        ].map((color) => (
                            <button
                                key={color}
                                onClick={() => updateColor(colorKey, color)}
                                className="w-6 h-6 rounded-full border shadow-sm hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Brand Colors */}
            <section>
                <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                    {renderColorPicker('primary', colors.primary)}
                    {renderColorPicker('secondary', colors.secondary)}
                    {renderColorPicker('accent', colors.accent)}
                </div>
            </section>

            {/* Text Colors */}
            <section>
                <h3 className="text-lg font-semibold mb-4">Text Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(colors.text).map(([key, value]) =>
                        renderColorPicker(`text.${key}`, value)
                    )}
                </div>
            </section>

            {/* Background Colors */}
            <section>
                <h3 className="text-lg font-semibold mb-4">Background Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(colors.background).map(([key, value]) =>
                        renderColorPicker(`background.${key}`, value)
                    )}
                </div>
            </section>
        </div>
    );
};