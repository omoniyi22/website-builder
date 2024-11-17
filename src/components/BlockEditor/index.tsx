import React, { useRef, useEffect } from 'react';
import type { Block } from '../../types';
import { BLOCK_TYPES } from './blocks';
import './blocks'; // This registers all the custom elements
import { BlockSelection } from './BlockSelection';
import { Settings, Move, Copy, Trash2 } from 'lucide-react';

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


    const renderBlock = (block: Block) => {
        const tagName = BLOCK_TYPES[block.type];
        if (!tagName) return null;

        return (
            <block-selection
                selected={selectedBlockId === block.id}
                focused={focusedBlockId === block.id}
                onClick={() => setSelectedBlockId(block.id)}
            >
                {/* Block controls */}
                <div slot="controls" className="flex items-center space-x-1">
                    <button
                        className="p-1 bg-white rounded shadow hover:bg-gray-50"
                        onClick={() => {/* Handle settings */}}
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow hover:bg-gray-50"
                        onClick={() => {/* Handle duplicate */}}
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow hover:bg-gray-50"
                        onClick={() => {/* Handle delete */}}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {React.createElement(tagName, {
                    'data-block-id': block.id,
                    block: block,
                    onFocus: () => setFocusedBlockId(block.id),
                    onBlur: () => setFocusedBlockId(null)
                })}
            </block-selection>
        );
    };


    useEffect(() => {
        // Add event listeners for block updates
        const handleBlockUpdate = (e: CustomEvent) => {
            const blockElement = e.target as HTMLElement;
            const blockId = blockElement.getAttribute('data-block-id');
            if (!blockId) return;

            const newBlocks = blocks.map(block =>
                block.id === blockId ? { ...block, ...e.detail } : block
            );
            onBlocksChange(newBlocks);
        };

        const editor = editorRef.current;
        if (editor) {
            editor.addEventListener('block-update', handleBlockUpdate as EventListener);
        }

        return () => {
            if (editor) {
                editor.removeEventListener('block-update', handleBlockUpdate as EventListener);
            }
        };
    }, [blocks, onBlocksChange]);

    const renderBlock = (block: Block) => {
        const tagName = BLOCK_TYPES[block.type];
        if (!tagName) return null;

        // Create the custom element
        return React.createElement(tagName, {
            key: block.id,
            'data-block-id': block.id,
            block: block,
            class: `block-wrapper ${isDragging ? 'is-dragging' : ''}`
        });
    };

    return (
        <div
            ref={editorRef}
            className="block-editor p-4 min-h-screen"
        >
            {blocks.map(renderBlock)}
        </div>
    );
};