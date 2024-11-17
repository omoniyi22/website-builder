import type { Block } from '../types';

interface HistoryState {
    blocks: Block[];
    timestamp: number;
    description: string;
}

export class HistoryManager {
    private undoStack: HistoryState[] = [];
    private redoStack: HistoryState[] = [];
    private maxHistory: number = 50;

    push(blocks: Block[], description: string) {
        // Add current state to undo stack
        this.undoStack.push({
            blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
            timestamp: Date.now(),
            description
        });

        // Clear redo stack when new action is performed
        this.redoStack = [];

        // Limit stack size
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
    }

    undo(): HistoryState | null {
        const state = this.undoStack.pop();
        if (!state) return null;

        // Add current state to redo stack
        this.redoStack.push(state);
        return this.undoStack[this.undoStack.length - 1] || null;
    }

    redo(): HistoryState | null {
        const state = this.redoStack.pop();
        if (!state) return null;

        this.undoStack.push(state);
        return state;
    }

    canUndo(): boolean {
        return this.undoStack.length > 1;
    }

    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    getLastAction(): string | null {
        const state = this.undoStack[this.undoStack.length - 1];
        return state ? state.description : null;
    }
}