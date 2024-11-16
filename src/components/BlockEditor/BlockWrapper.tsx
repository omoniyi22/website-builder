import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import type { Block } from '../../types';  // Fix the import path
import { Settings, Move, Copy, Trash2 } from 'lucide-react';

interface BlockWrapperProps {
    block: Block;
    index: number;
    children: React.ReactNode;
    moveBlock: (dragIndex: number, hoverIndex: number) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onUpdate: (updates: Partial<Block>) => void;
    onDraggingChange: (isDragging: boolean) => void;
}

interface DragItem {
    id: string;
    index: number;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
                                                              block,
                                                              index,
                                                              children,
                                                              moveBlock,
                                                              onDelete,
                                                              onDuplicate,
                                                              onUpdate,
                                                              onDraggingChange
                                                          }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [showSettings, setShowSettings] = useState(false);

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
        accept: 'BLOCK_SORT',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();

            if (!clientOffset) return;

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveBlock(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag<
        DragItem,
        void,
        { isDragging: boolean }
    >({
        type: 'BLOCK_SORT',
        item: () => ({
            id: block.id,
            index
        }),
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: () => onDraggingChange(false),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`relative group ${
                isDragging ? 'opacity-50' : ''
            }`}
            data-handler-id={handlerId}
        >
            {/* Block Controls */}
            <div className="absolute -left-12 top-0 bottom-0 w-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="p-1.5 hover:bg-gray-100 rounded mb-1"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings className="w-4 h-4 text-gray-400" />
                </button>
                <button
                    className="p-1.5 hover:bg-gray-100 rounded cursor-move"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Move className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Block Content */}
            <div className={`relative border border-transparent group-hover:border-gray-200 rounded-lg ${
                showSettings ? 'border-blue-500' : ''
            }`}>
                <div className="p-4">{children}</div>

                {/* Block Settings Panel */}
                {showSettings && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Block Settings</h4>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Width</label>
                                <select
                                    value={block.settings.width}
                                    onChange={(e) => onUpdate({
                                        settings: { ...block.settings, width: e.target.value as 'normal' | 'wide' | 'full' }
                                    })}
                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="wide">Wide</option>
                                    <option value="full">Full width</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Alignment</label>
                                <select
                                    value={block.settings.alignment}
                                    onChange={(e) => onUpdate({
                                        settings: { ...block.settings, alignment: e.target.value as 'left' | 'center' | 'right' }
                                    })}
                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Padding</label>
                                <select
                                    value={block.settings.padding}
                                    onChange={(e) => onUpdate({
                                        settings: { ...block.settings, padding: e.target.value as 'none' | 'small' | 'normal' | 'large' }
                                    })}
                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                                >
                                    <option value="none">None</option>
                                    <option value="small">Small</option>
                                    <option value="normal">Normal</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={onDuplicate}
                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate Block
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex items-center text-sm text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Block
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};