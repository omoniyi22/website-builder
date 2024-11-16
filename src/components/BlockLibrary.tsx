import React from 'react';
import { BlockType } from '../types/blocks';

interface BlockLibraryProps {
    searchTerm: string;
    onBlockSelect: (blockType: BlockType) => void;
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
                                                              searchTerm,
                                                              onBlockSelect
                                                          }) => {
    return (
        <div>
            {/* Block library content */}
        </div>
    );
};