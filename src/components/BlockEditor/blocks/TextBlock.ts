import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block } from '../../../types';
import type { ThemeSettings } from '../../ThemeEditor/themeSystem';

interface TextBlockContent {
    text: string;
    style: 'normal' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'accent';
    alignment: 'left' | 'center' | 'right';
    color: 'primary' | 'secondary' | 'accent' | 'custom';
    customColor?: string;
    format: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
    };
    links: Array<{
        text: string;
        url: string;
        range: [number, number];
    }>;
}

@customElement('site-text-block')
export class TextBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @property({ type: Object }) theme!: ThemeSettings;
    @state() private isEditing = false;

    static styles = css`
        :host {
            display: block;
        }
        .text-container {
            position: relative;
            width: 100%;
        }
        .text-content {
            width: 100%;
            outline: none;
            transition: all 0.2s ease;
        }
        .text-content:focus {
            box-shadow: 0 0 0 2px var(--theme-primary-color, #3B82F6);
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
            box-shadow: var(--theme-shadow-medium);
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        :host([editing]) .toolbar {
            opacity: 1;
        }
        .toolbar-button {
            padding: 0.25rem;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 0.25rem;
            color: var(--theme-text-secondary);
        }
        .toolbar-button:hover {
            background: var(--theme-background-secondary);
        }
        .toolbar-button[active] {
            color: var(--theme-primary-color);
            background: var(--theme-background-accent);
        }
        
        /* Text styles based on theme */
        .style-heading1 {
            font-size: var(--theme-h1-size);
            font-weight: var(--theme-h1-weight);
            line-height: var(--theme-h1-line-height);
            letter-spacing: var(--theme-h1-letter-spacing);
            font-family: var(--theme-h1-font-family);
        }
        .style-heading2 {
            font-size: var(--theme-h2-size);
            font-weight: var(--theme-h2-weight);
            line-height: var(--theme-h2-line-height);
            letter-spacing: var(--theme-h2-letter-spacing);
            font-family: var(--theme-h2-font-family);
        }
        /* ...similar styles for other heading levels... */
        
        .style-accent {
            font-size: var(--theme-accent-size);
            font-weight: var(--theme-accent-weight);
            line-height: var(--theme-accent-line-height);
            font-family: var(--theme-accent-font-family);
        }
    `;

    private handleInput(e: InputEvent) {
        const target = e.target as HTMLElement;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...this.block.content,
                    text: target.innerText
                }
            }
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
            }
        }));
    }

    private changeStyle(style: TextBlockContent['style']) {
        const content = this.block.content as TextBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    style
                }
            }
        }));
    }

    private renderToolbar() {
        const content = this.block.content as TextBlockContent;
        return html`
            <div class="toolbar">
                <select
                    @change=${(e: Event) => this.changeStyle((e.target as HTMLSelectElement).value as TextBlockContent['style'])}
                >
                    <option value="normal">Normal</option>
                    <option value="heading1">Heading 1</option>
                    <option value="heading2">Heading 2</option>
                    <option value="heading3">Heading 3</option>
                    <option value="heading4">Heading 4</option>
                    <option value="accent">Accent</option>
                </select>
                
                <button
                    class="toolbar-button"
                    ?active=${content.format.bold}
                    @click=${() => this.toggleFormat('bold')}
                    title="Bold"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M8.5 3H5v10h4.5c1.93 0 3.5-1.57 3.5-3.5S10.43 6 8.5 6H7V3h1.5zM8.5 8c.83 0 1.5.67 1.5 1.5S9.33 11 8.5 11H7V8h1.5z"/>
                    </svg>
                </button>
                
                <button
                    class="toolbar-button"
                    ?active=${content.format.italic}
                    @click=${() => this.toggleFormat('italic')}
                    title="Italic"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M7 3h4v2h-1l-2 6h1v2H5v-2h1l2-6H7V3z"/>
                    </svg>
                </button>

                <!-- Add more toolbar buttons for other formatting options -->
            </div>
        `;
    }

    render() {
        const content = this.block.content as TextBlockContent;

        return html`
            <div class="text-container">
                ${this.isEditing ? this.renderToolbar() : ''}
                <div
                    class="text-content style-${content.style}"
                    contenteditable="true"
                    style="
                        text-align: ${content.alignment};
                        color: var(--theme-text-${content.color});
                        ${content.format.bold ? 'font-weight: bold;' : ''}
                        ${content.format.italic ? 'font-style: italic;' : ''}
                        ${content.format.underline ? 'text-decoration: underline;' : ''}
                        ${content.format.strikethrough ? 'text-decoration: line-through;' : ''}
                    "
                    @focus=${() => this.isEditing = true}
                    @blur=${() => this.isEditing = false}
                    @input=${this.handleInput}
                    .innerHTML=${content.text}
                ></div>
            </div>
        `;
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('theme')) {
            this.style.setProperty('--theme-primary-color', this.theme.colors.primary);
            this.style.setProperty('--theme-h1-size', this.theme.typography.headings.h1.fontSize);
            // ... set other theme CSS variables
        }
    }
}