import "./editor.css"
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Block } from '../../types';
import { BLOCK_TYPES } from './blockTypes';

interface BlockEditorProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
    isDragging: boolean;
    onDraggingChange: (isDragging: boolean) => void;
}

export const EditorPlate: React.FC<BlockEditorProps> = ({
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

    // Usage
    const pageStructure = {
        type: 'div',
        props: { className: 'editor-container' },
        children: [
            {
                type: 'header', props: {}, children: [
                    { type: 'h1', props: {}, children: ['Dynamic Page'] }]
            }
        ]
    };

    const componentFactory = (type: any, props: any, children: any) => {
        return React.createElement(type, props, ...children.map((child: any) => componentFactory(child.type, child.props, child.children || [])));
    };

    const page = componentFactory(pageStructure.type, pageStructure.props, pageStructure.children);

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
                className={` block-wrapper  px-3 border-white ${selectedBlockId === block.id ? 'selected' : ''
                    } ${focusedBlockId === block.id ? 'focused' : ''}`}
                onClick={() => setSelectedBlockId(block.id)}
            >
                sdms'dm'
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
            className="block-editor editor_box pt-[0.68rem]  min-h-screen bg-[rgb(232,234,237)] w-[calc(100%-320px)] mr-auto"
        >
            <div className="editor_block border border-[#DADCE0] min-w-full pb-7  px-[3.7rem] bg-[#F1F3F4]">
                <div className="main_block bg-white min-h-[100vh] shadow-[]">
                    {blocks.map(renderBlock)}
                </div>
            </div>
        </div>
    );
};