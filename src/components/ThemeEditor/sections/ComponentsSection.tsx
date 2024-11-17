import React from 'react';
import type { Theme } from '../../../types';

interface ComponentsSectionProps {
    theme: Theme;
    onChange: (updates: Partial<Theme>) => void;
}

export const ComponentsSection: React.FC<ComponentsSectionProps> = ({
                                                                        theme,
                                                                        onChange
                                                                    }) => {
    return (
        <div>Component settings coming soon...</div>
    );
};