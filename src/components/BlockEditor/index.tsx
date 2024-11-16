import React from 'react';
import type { Block } from '../../types';  // Fix the import path

interface BlockEditorProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
    isDragging: boolean;
    onDraggingChange: (isDragging: boolean) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
                                                     blocks,
                                                     onBlocksChange,
                                                     isDragging,
                                                     onDraggingChange
                                                 }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
                {blocks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Drag and drop blocks here
                    </div>
                ) : (
                    <div className="p-8 space-y-4">
                        {blocks.map((block, index) => (
                            <div key={block.id} className="border p-4 rounded">
                                {block.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export { BlockEditor };
export type { BlockEditorProps };