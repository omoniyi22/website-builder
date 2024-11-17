export interface ThemeSettings {
    typography: {
        headings: {
            h1: {
                fontSize: string;
                fontWeight: string;
                lineHeight: string;
                fontFamily: string;
                letterSpacing: string;
            };
            h2: {
                fontSize: string;
                fontWeight: string;
                lineHeight: string;
                fontFamily: string;
                letterSpacing: string;
            };
            h3: {
                fontSize: string;
                fontWeight: string;
                lineHeight: string;
                fontFamily: string;
                letterSpacing: string;
            };
            h4: {
                fontSize: string;
                fontWeight: string;
                lineHeight: string;
                fontFamily: string;
            };
        };
        body: {
            fontSize: string;
            fontWeight: string;
            lineHeight: string;
            fontFamily: string;
        };
        accent: {
            fontSize: string;
            fontWeight: string;
            lineHeight: string;
            fontFamily: string;
        };
    };
    colors: {
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
    };
    spacing: {
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
    };
    borderRadius: {
        small: string;
        medium: string;
        large: string;
    };
    shadows: {
        small: string;
        medium: string;
        large: string;
    };
}

export const defaultTheme: ThemeSettings = {
    typography: {
        headings: {
            h1: {
                fontSize: '2.5rem',
                fontWeight: '700',
                lineHeight: '1.2',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em'
            },
            h2: {
                fontSize: '2rem',
                fontWeight: '600',
                lineHeight: '1.3',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em'
            },
            h3: {
                fontSize: '1.5rem',
                fontWeight: '600',
                lineHeight: '1.4',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em'
            },
            h4: {
                fontSize: '1.25rem',
                fontWeight: '500',
                lineHeight: '1.4',
                fontFamily: 'Inter, sans-serif'
            }
        },
        body: {
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '1.5',
            fontFamily: 'Inter, sans-serif'
        },
        accent: {
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1.4',
            fontFamily: 'Inter, sans-serif'
        }
    },
    colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: {
            primary: '#FFFFFF',
            secondary: '#F3F4F6',
            accent: '#F0FDF4'
        },
        text: {
            primary: '#1F2937',
            secondary: '#4B5563',
            accent: '#059669',
            inverse: '#FFFFFF'
        }
    },
    spacing: {
        content: {
            maxWidth: '1200px',
            padding: '2rem'
        },
        block: {
            padding: {
                small: '1rem',
                medium: '2rem',
                large: '4rem'
            },
            margin: {
                small: '1rem',
                medium: '2rem',
                large: '4rem'
            }
        }
    },
    borderRadius: {
        small: '0.25rem',
        medium: '0.5rem',
        large: '1rem'
    },
    shadows: {
        small: '0 1px 2px rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
};