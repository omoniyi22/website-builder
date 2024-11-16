import { useState } from 'react';
import { Site } from '../types';

export const useSiteData = () => {
    const getSiteData = async () => {
        return {} as Site;
    };

    const saveSite = async (site: Site) => {
        console.log('Saving site:', site);
    };

    const publishSite = async (site: Site) => {
        console.log('Publishing site:', site);
    };

    return { getSiteData, saveSite, publishSite };
};