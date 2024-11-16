import React from 'react';
import type { Block } from '../../../types';  // Import only the types we need
import { Layout, Plus, Minus, Settings, Move } from 'lucide-react';
import { BlockEditor } from '../index';

interface ColumnsBlockProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
}

type Column = {
    id: string;
    width: number;
    blocks: Block[];
};

interface ColumnContent {
    columns: Column[];
}

export const ColumnsBlock: React.FC<ColumnsBlockProps> = ({ block, onUpdate }) => {
    // Type guard to ensure column content is correct
    const isColumnContent = (content: any): content is ColumnContent => {
        return Array.isArray((content as ColumnContent)?.columns);
    };

    const updateColumnBlocks = (columnId: string, newBlocks: Block[]) => {
        const content = block.content;

        if (!isColumnContent(content)) {
            console.error('Invalid column content');
            return;
        }

        const newColumns = content.columns.map(col =>
            col.id === columnId ? { ...col, blocks: newBlocks } : col
        );

        onUpdate({
            content: { columns: newColumns }
        });
    };

    const content = block.content;
    if (!isColumnContent(content)) {
        return (
            <div className="p-4 text-red-500">
                Invalid column configuration
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            {content.columns.map(column => (
                <div
                    key={column.id}
                    style={{ width: `${column.width * 100}%` }}
                    className="border-r border-gray-200 last:border-r-0"
                >
                    <BlockEditor
                        blocks={column.blocks}
                        onBlocksChange={(newBlocks) => updateColumnBlocks(column.id, newBlocks)}
                        isDragging={false}
                        onDraggingChange={() => {}}
                    />
                </div>
            ))}
        </div>
    );
};