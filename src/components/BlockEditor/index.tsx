import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Block } from '../../types';
import { BLOCK_TYPES } from './blockTypes';

interface BlockEditorProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
    isDragging: boolean;
    onDraggingChange: (isDragging: boolean) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
                                                            blocks,
                                                            onBlocksChange,
                                                            isDragging,
                                                            onDraggingChange
                                                        }) => {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Handle block updates
    const handleBlockUpdate = useCallback((e: CustomEvent) => {
        const blockElement = e.target as HTMLElement;
        const blockId = blockElement.getAttribute('data-block-id');
        if (!blockId) return;

        const newBlocks = blocks.map(block =>
            block.id === blockId ? { ...block, ...e.detail } : block
        );
        onBlocksChange(newBlocks);
    }, [blocks, onBlocksChange]);

    // Initialize event listeners
    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.addEventListener('block-update', handleBlockUpdate as EventListener);
        }
        return () => {
            if (editor) {
                editor.removeEventListener('block-update', handleBlockUpdate as EventListener);
            }
        };
    }, [handleBlockUpdate]);

    // Single renderBlock implementation
    const renderBlock = useCallback((block: Block) => {
        const tagName = BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES];
        if (!tagName) return null;

        return (
            <div
                key={block.id}
                className={`block-wrapper ${
                    selectedBlockId === block.id ? 'selected' : ''
                } ${focusedBlockId === block.id ? 'focused' : ''}`}
                onClick={() => setSelectedBlockId(block.id)}
            >
                {/* Block controls */}
                <div className="block-controls">
                    {/* Your controls JSX */}
                </div>

                {/* Render the Lit component */}
                {React.createElement(tagName, {
                    'data-block-id': block.id,
                    block: block,
                    onFocus: () => setFocusedBlockId(block.id),
                    onBlur: () => setFocusedBlockId(null)
                })}
            </div>
        );
    }, [selectedBlockId, focusedBlockId]);

    return (
        <div
            ref={editorRef}
            className="block-editor p-4 min-h-screen"
        >
            {blocks.map(renderBlock)}
        </div>
    );
};