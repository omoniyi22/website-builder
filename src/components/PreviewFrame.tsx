import React from 'react';
import type { Site, Page, Block, TextBlockContent } from '../types';

interface PreviewFrameProps {
    site: Site | null;
    currentPage: Page | null;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
    site,
    currentPage
}) => {
    if (!currentPage) return null;

    const renderBlockContent = (block: Block) => {
        switch (block.type) {
            case 'text':
                return <div dangerouslySetInnerHTML={{
                    __html: (block.content as TextBlockContent).text || ''
                }} />;
            case 'image':
                return <img
                    src={block.content.url || ''}
                    alt={block.content.alt || ''}
                />;
            // Add cases for other block types
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#F1F3F4] h-full">
            <div className="max-w-4xl mx-auto p-8 border">
                <h1 className="text-3xl font-bold mb-8">{currentPage.title}</h1>
                <div>
                    {currentPage.content.map(block => (
                        <div key={block.id} className="mb-4">
                            {renderBlockContent(block)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};