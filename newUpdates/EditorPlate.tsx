
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Block } from '../../types';
import { BLOCK_TYPES } from './blockTypes';
import RenderPage from "./renderComponent";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';

interface EditorPlateProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
    isDragging: boolean;
    onDraggingChange: (isDragging: boolean) => void;
}

export const EditorPlate: React.FC<EditorPlateProps> = ({
    blocks,
    onBlocksChange,
    isDragging,
    onDraggingChange
}) => {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
    const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Handle block updates
    const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
        const newBlocks = blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        );
        onBlocksChange(newBlocks);
    }, [blocks, onBlocksChange]);

    // Drop target for drag and drop
    const [, drop] = useDrop({
        accept: 'BLOCK',
        drop: (item: { type: string }, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) return;

            // Add new block at drop position
            const clientOffset = monitor.getClientOffset();
            if (clientOffset && editorRef.current) {
                const hoverBoundingRect = editorRef.current.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                let insertIndex = 0;
                if (hoverClientY > hoverMiddleY) {
                    insertIndex = blocks.length;
                }

                const newBlock: Block = {
                    id: `block-${Date.now()}`,
                    type: item.type as Block['type'],
                    content: [],
                    settings: {
                        width: 'normal',
                        alignment: 'left',
                        padding: 'normal'
                    },
                    className: ''
                };

                const newBlocks = [...blocks];
                newBlocks.splice(insertIndex, 0, newBlock);
                onBlocksChange(newBlocks);
            }
        }
    });

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' && selectedBlockId) {
                const newBlocks = blocks.filter(block => block.id !== selectedBlockId);
                onBlocksChange(newBlocks);
                setSelectedBlockId(null);
            }
        };

        editor.addEventListener('keydown', handleKeyDown);
        return () => editor.removeEventListener('keydown', handleKeyDown);
    }, [blocks, selectedBlockId, onBlocksChange]);

    // Initialize block reference for drag preview
    useEffect(() => {
        if (draggedBlock) {
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            img.style.opacity = '0.5';
            document.body.appendChild(img);
            return () => document.body.removeChild(img);
        }
    }, [draggedBlock]);

    return (
        <div
            ref={drop(editorRef)}
            className="block-editor editor_box pt-[0.68rem] min-h-screen bg-[rgb(232,234,237)] w-[calc(100%-320px)] mr-auto"
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="editor_block border border-[#DADCE0] min-w-full pb-7 py-3 px-[3.7rem] bg-[#F1F3F4]">
                <div className="main_block min-h-[100vh] shadow-lg bg-white">
                    <RenderPage 
                        blocks={blocks}
                        selectedBlockId={selectedBlockId}
                        onBlockSelect={setSelectedBlockId}
                        onBlockUpdate={handleBlockUpdate}
                    />
                    {blocks.length === 0 && (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            Drag and drop blocks here
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    );
};

