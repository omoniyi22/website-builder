import React from 'react';
import type { ThemeSpacing } from '../../../types';

interface SpacingSectionProps {
    spacing: ThemeSpacing;
    onChange: (spacing: ThemeSpacing) => void;
}

export const SpacingSection: React.FC<SpacingSectionProps> = ({
                                                                  spacing,
                                                                  onChange
                                                              }) => {
    return (
        <div>Spacing settings coming soon...</div>
    );
};