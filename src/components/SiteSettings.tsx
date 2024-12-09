import React from 'react';
import { Site } from '../types';

interface SiteSettingsProps {
    site: Site;
    onUpdate: (updates: Partial<Site>) => void;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({
    site,
    onUpdate
}) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Site Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input
                        type="text"
                        value={site.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};