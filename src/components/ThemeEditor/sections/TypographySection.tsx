import React from 'react';
import type { Theme } from '../../../types';

interface TypographySectionProps {
    typography: NonNullable<Theme['typography']>;
    onChange: (typography: NonNullable<Theme['typography']>) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
                                                                        typography,
                                                                        onChange
                                                                    }) => {
    // Component implementation
};