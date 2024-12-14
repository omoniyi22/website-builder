import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block, LayoutBlockContent } from '../../../types';

@customElement('site-layout-block')
export class LayoutBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private draggedColumnIndex: number | null = null;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        .layout-container {
            display: grid;
            gap: var(--layout-gap, 1rem);
            min-height: 100px;
        }

        .layout-column {
            position: relative;
            min-height: 100px;
            background: var(--theme-background-secondary);
            border-radius: 0.375rem;
            transition: background-color 0.2s;
        }

        .layout-column.dragging-over {
            background: var(--theme-background-accent);
        }

        .column-resize-handle {
            position: absolute;
            top: 0;
            right: -4px;
            width: 8px;
            height: 100%;
            cursor: col-resize;
            z-index: 10;
        }

        .column-resize-handle:hover,
        .column-resize-handle.active {
            background: var(--theme-primary);
        }

        .layout-controls {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            background: white;
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        :host(:hover) .layout-controls {
            opacity: 1;
            visibility: visible;
        }

        .control-button {
            padding: 0.5rem;
            background: none;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            color: var(--theme-text-secondary);
        }

        .control-button:hover {
            background: var(--theme-background-secondary);
        }

        @media (max-width: 768px) {
            .layout-container[data-stack="true"] {
                grid-template-columns: 1fr !important;
            }
        }
    `;

    private updateColumns(updates: Partial<LayoutBlockContent>) {
        const content = this.block.content as LayoutBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    ...updates
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    private handleColumnResize(columnIndex: number, e: MouseEvent) {
        const startX = e.clientX;
        const columns = (this.block.content as LayoutBlockContent).columns;
        const startWidths = columns.map(col => col.width);

        const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - startX;
            const containerWidth = this.offsetWidth;
            const diffPercent = (diff / containerWidth) * 100;

            // Update column widths while maintaining total of 100%
            const newWidths = [...startWidths];
            newWidths[columnIndex] = Math.max(20, Math.min(80, startWidths[columnIndex] + diffPercent));
            newWidths[columnIndex + 1] = Math.max(20, Math.min(80, startWidths[columnIndex + 1] - diffPercent));

            this.updateColumns({
                columns: columns.map((col, i) => ({
                    ...col,
                    width: newWidths[i] || col.width
                }))
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    render() {
        const content = this.block.content as LayoutBlockContent;

        return html`
            <div 
                class="layout-container"
                style=${`
                    grid-template-columns: ${content.columns.map(col => `${col.width}%`).join(' ')};
                    --layout-gap: ${content.gap}rem;
                `}
                data-stack=${content.stackOnMobile}
            >
                ${content.columns.map((column, i) => html`
                    <div 
                        class="layout-column ${this.draggedColumnIndex === i ? 'dragging-over' : ''}"
                        @dragenter=${() => this.draggedColumnIndex = i}
                        @dragleave=${() => this.draggedColumnIndex = null}
                    >
                        <slot name="column-${i}"></slot>
                        ${i < content.columns.length - 1 ? html`
                            <div 
                                class="column-resize-handle"
                                @mousedown=${(e: MouseEvent) => this.handleColumnResize(i, e)}
                            ></div>
                        ` : null}
                    </div>
                `)}
            </div>

            <div class="layout-controls">
                <button 
                    class="control-button"
                    @click=${() => this.updateColumns({
                        columns: [...content.columns, { width: 100 / (content.columns.length + 1), blocks: [] }]
                    })}
                >
                    Add Column
                </button>
                <button 
                    class="control-button"
                    @click=${() => this.updateColumns({
                        stackOnMobile: !content.stackOnMobile
                    })}
                >
                    ${content.stackOnMobile ? 'Unstack' : 'Stack'} on Mobile
                </button>
                <button 
                    class="control-button"
                    @click=${() => this.updateColumns({
                        gap: (content.gap || 1) + 0.5
                    })}
                >
                    Increase Gap
                </button>
            </div>
        `;
    }
}