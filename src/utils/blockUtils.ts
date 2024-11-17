import type { Block } from '../types';

export const reorderBlocks = (
    blocks: Block[],
    sourceIndex: number,
    destinationIndex: number
): Block[] => {
    const result = Array.from(blocks);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    return result;
};

export const moveBlockToColumn = (
    sourceBlocks: Block[],
    destinationBlocks: Block[],
    sourceIndex: number,
    destinationIndex: number
): {
    sourceBlocks: Block[];
    destinationBlocks: Block[];
} => {
    const sourceResult = Array.from(sourceBlocks);
    const [removed] = sourceResult.splice(sourceIndex, 1);
    const destinationResult = Array.from(destinationBlocks);
    destinationResult.splice(destinationIndex, 0, removed);

    return {
        sourceBlocks: sourceResult,
        destinationBlocks: destinationResult
    };
};