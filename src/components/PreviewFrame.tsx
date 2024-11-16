import React from 'react';
import { Site, Page } from '../types';

interface PreviewFrameProps {
    site: Site;
    currentPage: Page | null;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
                                                              site,
                                                              currentPage
                                                          }) => {
    if (!currentPage) return null;

    return (
        <div className="bg-white h-full">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">{currentPage.title}</h1>
                <div>
                    {currentPage.content.map(block => (
                        <div key={block.id} className="mb-4">
                            {block.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};