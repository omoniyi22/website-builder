// In hooks/useSiteData.ts
import { Site } from '../types';

export const useSiteData = () => {
    const getSiteData = async (): Promise<Site> => {
        // Return initialized site with empty pages array
        const initialSite: Site = {
            id: '1',
            name: 'Untitled Site',
            pages: [], // Initialize with empty array
            theme: {
                id: '1',
                name: 'Default',
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
                fonts: {
                    heading: 'Inter',
                    body: 'Inter'
                }
            }
        };

        return Promise.resolve(initialSite);
    };

    const saveSite = async (site: Site): Promise<void> => {
        console.log('Saving site:', site);
        return Promise.resolve();
    };

    const publishSite = async (site: Site): Promise<void> => {
        console.log('Publishing site:', site);
        return Promise.resolve();
    };

    return { getSiteData, saveSite, publishSite };
};