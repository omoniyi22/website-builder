import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Settings, Move, Copy, Trash2 } from 'lucide-react';
import type { Block } from '../../types';

interface BlockWrapperProps {
    block: Block;
    index: number;
    moveBlock: (dragIndex: number, hoverIndex: number) => void;
    duplicateBlock: (blockId: string) => void;
    deleteBlock: (id: string) => void;
    onSettingsOpen: (id: string) => void;
    children?: React.ReactNode;
}

interface DragItem {
    id: string;
    index: number;
    type: string;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
    block,
    index,
    moveBlock,
    duplicateBlock,
    deleteBlock,
    onSettingsOpen,
    children
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'BLOCK',
        item: { id: block.id, index, type: 'BLOCK' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'BLOCK',
        hover: (item: DragItem, monitor) => {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveBlock(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    drag(preview(drop(ref)));

    return (
        <div
            ref={ref}
            className={`
                group relative rounded-lg transition-all duration-200
                ${isDragging ? 'opacity-50' : ''}
                ${isOver ? 'scale-105' : ''}
            `}
        >
            {/* Block Controls */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center space-y-2">
                    <button
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Move className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Block Settings */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center space-y-2">
                    <button
                        onClick={() => onSettingsOpen(block.id)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                    >
                        <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => duplicateBlock(block.id)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                    >
                        <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => deleteBlock(block.id)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                    >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Block Content */}
            <div className={`
                px-4 py-2 rounded-lg transition-colors duration-200
                ${isOver ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}>
                {children}
            </div>

            {/* Drop Indicators */}
            <div className={`
                absolute inset-x-0 h-1 -top-1 bg-blue-500 transform scale-x-0 transition-transform
                ${isOver && canDrop ? 'scale-x-100' : ''}
            `} />
            <div className={`
                absolute inset-x-0 h-1 -bottom-1 bg-blue-500 transform scale-x-0 transition-transform
                ${isOver && canDrop ? 'scale-x-100' : ''}
            `} />
        </div>
    );
};