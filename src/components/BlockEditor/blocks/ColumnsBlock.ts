import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Block } from '../../../types';

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

    private handleColumnUpdate(columnId: string, blocks: Block[]) {
        const newColumns = this.block.content.columns.map(col =>
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

    render() {
        const { settings, content } = this.block;

        return html`
            <div class="columns-block width-${settings.width}">
                <div class="columns">
                    ${content.columns.map(column => html`
                        <div class="column" style="width: ${column.width * 100}%">
                            <slot name="column-${column.id}"></slot>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }
}