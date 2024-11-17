import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Block, BlockContent, ColumnsBlockContent, Column } from '../../../types';

@customElement('site-columns-block')
export class ColumnsBlock extends LitElement {
    @property({ type: Object }) block!: Block;

    static styles = css`
        :host {
            display: block;
        }
        .columns {
            display: flex;
            gap: 1rem;
        }
        .column {
            flex: 1;
            min-width: 0;
        }
        .width-normal { max-width: 800px; margin: 0 auto; }
        .width-wide { max-width: 1200px; margin: 0 auto; }
        .width-full { width: 100%; }
    `;

    private isColumnsContent(content: BlockContent): content is ColumnsBlockContent {
        return 'columns' in content && Array.isArray((content as ColumnsBlockContent).columns);
    }

    private handleColumnUpdate(columnId: string, blocks: Block[]) {
        if (!this.isColumnsContent(this.block.content)) return;

        const newColumns = this.block.content.columns.map((col: Column) =>
            col.id === columnId ? { ...col, blocks } : col
        );

        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: { ...this.block.content, columns: newColumns }
            },
            bubbles: true,
            composed: true
        }));
    }

    private renderColumn(column: Column) {
        return html`
            <div class="column" style="width: ${column.width * 100}%">
                <slot name="column-${column.id}"></slot>
            </div>
        `;
    }

    private renderColumns(columns: Column[]) {
        return columns.map((column: Column) => this.renderColumn(column));
    }

    render() {
        const { settings, content } = this.block;

        if (!this.isColumnsContent(content)) {
            return html`<div>Invalid column content</div>`;
        }

        return html`
            <div class="columns-block width-${settings.width}">
                <div class="columns">
                    ${this.renderColumns(content.columns)}
                </div>
            </div>
        `;
    }
}