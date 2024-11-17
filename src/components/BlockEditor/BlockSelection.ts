import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('block-selection')
export class BlockSelection extends LitElement {
    @property({ type: Boolean, reflect: true }) selected = false;
    @property({ type: Boolean, reflect: true }) focused = false;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }
        .selection-outline {
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            pointer-events: none;
            border: 2px solid transparent;
            border-radius: 4px;
            transition: border-color 0.2s;
        }
        :host([selected]) .selection-outline {
            border-color: #3b82f6;
        }
        :host([focused]) .selection-outline {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .selection-controls {
            position: absolute;
            top: -32px;
            right: 0;
            display: flex;
            gap: 4px;
            opacity: 0;
            transform: translateY(8px);
            transition: all 0.2s;
        }
        :host([selected]) .selection-controls {
            opacity: 1;
            transform: translateY(0);
        }
        ::slotted(*) {
            position: relative;
            z-index: 1;
        }
    `;

    render() {
        return html`
            <div class="block-selection">
                <div class="selection-outline"></div>
                <div class="selection-controls">
                    <slot name="controls"></slot>
                </div>
                <slot></slot>
            </div>
        `;
    }
}