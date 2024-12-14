
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block, TextBlockContent } from '../../../types';

@customElement('site-text-block')
export class TextBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private selection: Range | null = null;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }
        
        .text-container {
            position: relative;
            width: 100%;
        }

        .text-content {
            width: 100%;
            outline: none;
            transition: all 0.2s ease;
            min-height: 1em;
        }

        .toolbar {
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

        :host([editing]) .toolbar {
            opacity: 1;
            visibility: visible;
        }

        .toolbar-button {
            padding: 0.5rem;
            background: none;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            color: var(--theme-text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .toolbar-button:hover {
            background: var(--theme-background-secondary);
        }

        .toolbar-button[active] {
            color: var(--theme-primary);
            background: var(--theme-background-accent);
        }

        .toolbar-separator {
            width: 1px;
            height: 24px;
            background: var(--theme-border);
            margin: 0 0.25rem;
        }

        /* Text styles */
        .format-h1 { font-size: 2.5rem; font-weight: bold; }
        .format-h2 { font-size: 2rem; font-weight: bold; }
        .format-h3 { font-size: 1.5rem; font-weight: bold; }
        .format-p { font-size: 1rem; }
        .format-quote { 
            font-size: 1.25rem;
            font-style: italic;
            border-left: 4px solid var(--theme-primary);
            padding-left: 1rem;
        }
    `;

    private handleInput(e: InputEvent) {
        const content = this.block.content as TextBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    text: (e.target as HTMLElement).textContent || '',
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    private toggleFormat(format: keyof TextBlockContent['format']) {
        const content = this.block.content as TextBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    format: {
                        ...content.format,
                        [format]: !content.format[format]
                    }
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    private changeStyle(style: string) {
        const content = this.block.content as TextBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    style
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    private handleKeyDown(e: KeyboardEvent) {
        // Handle special key combinations
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Create a new text block below
            this.dispatchEvent(new CustomEvent('create-block', {
                detail: { type: 'text', after: this.block.id },
                bubbles: true,
                composed: true
            }));
        }

        if (e.key === 'Backspace' && (e.target as HTMLElement).textContent === '') {
            e.preventDefault();
            // Delete empty block
            this.dispatchEvent(new CustomEvent('delete-block', {
                detail: { id: this.block.id },
                bubbles: true,
                composed: true
            }));
        }
    }

    private saveSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.selection = selection.getRangeAt(0).cloneRange();
        }
    }

    private restoreSelection() {
        if (this.selection) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(this.selection);
        }
    }

    render() {
        const content = this.block.content as TextBlockContent;

        return html`
            <div class="text-container">
                ${this.isEditing ? html`
                    <div class="toolbar">
                        <button class="toolbar-button" @click=${() => this.changeStyle('p')}>
                            <span>¶</span>
                        </button>
                        <button class="toolbar-button" @click=${() => this.changeStyle('h1')}>
                            <span>H1</span>
                        </button>
                        <button class="toolbar-button" @click=${() => this.changeStyle('h2')}>
                            <span>H2</span>
                        </button>
                        <button class="toolbar-button" @click=${() => this.changeStyle('h3')}>
                            <span>H3</span>
                        </button>

                        <div class="toolbar-separator"></div>

                        <button 
                            class="toolbar-button" 
                            ?active=${content.format.bold}
                            @click=${() => this.toggleFormat('bold')}
                        >
                            <span>B</span>
                        </button>
                        <button 
                            class="toolbar-button"
                            ?active=${content.format.italic}
                            @click=${() => this.toggleFormat('italic')}
                        >
                            <span>I</span>
                        </button>
                        <button 
                            class="toolbar-button"
                            ?active=${content.format.underline}
                            @click=${() => this.toggleFormat('underline')}
                        >
                            <span>U</span>
                        </button>
                    </div>
                ` : null}

                <div
                    class="text-content format-${content.style || 'p'}"
                    contenteditable="true"
                    @input=${this.handleInput}
                    @keydown=${this.handleKeyDown}
                    @focus=${() => {
                        this.isEditing = true;
                        this.saveSelection();
                    }}
                    @blur=${() => {
                        this.isEditing = false;
                        this.saveSelection();
                    }}
                    style="
                        ${content.format.bold ? 'font-weight: bold;' : ''}
                        ${content.format.italic ? 'font-style: italic;' : ''}
                        ${content.format.underline ? 'text-decoration: underline;' : ''}
                    "
                >${content.text}</div>
            </div>
        `;
    }
}
