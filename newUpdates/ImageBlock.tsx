
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block, ImageBlockContent } from '../../../types';

@customElement('site-image-block')
export class ImageBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private isDraggingFocalPoint = false;
    @state() private isResizing = false;
    @state() private uploadProgress = 0;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        .image-container {
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        :host(:hover) .overlay {
            opacity: 1;
        }

        .controls {
            display: flex;
            gap: 1rem;
        }

        .control-button {
            padding: 0.5rem 1rem;
            background: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .focal-point {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--theme-primary);
            transform: translate(-50%, -50%);
            cursor: move;
        }

        .resize-handle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border: 2px solid var(--theme-primary);
            right: -5px;
            bottom: -5px;
            cursor: se-resize;
        }

        .upload-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255,255,255,0.3);
        }

        .upload-progress-bar {
            height: 100%;
            background: var(--theme-primary);
            transition: width 0.3s ease;
        }

        .image-caption {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--theme-text-secondary);
            text-align: center;
        }

        input[type="file"] {
            display: none;
        }
    `;

    private handleImageUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        // Simulate upload progress
        const interval = setInterval(() => {
            this.uploadProgress += 10;
            if (this.uploadProgress >= 100) {
                clearInterval(interval);

                // Read file and update block
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = this.block.content as ImageBlockContent;
                    this.dispatchEvent(new CustomEvent('block-update', {
                        detail: {
                            ...this.block,
                            content: {
                                ...content,
                                url: e.target?.result as string,
                                originalName: file.name
                            }
                        },
                        bubbles: true,
                        composed: true
                    }));
                    this.uploadProgress = 0;
                };
                reader.readAsDataURL(file);
            }
        }, 100);
    }

    private handleFocalPointDrag(e: MouseEvent) {
        if (!this.isDraggingFocalPoint) return;

        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const content = this.block.content as ImageBlockContent;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...content,
                    focalPoint: { x, y }
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const content = this.block.content as ImageBlockContent;

        return html`
            <div class="image-container">
                <div class="image-wrapper">
                    <img 
                        src=${content.url} 
                        alt=${content.alt || ''} 
                        style=${content.focalPoint ? `
                            transform: scale(1.1) translate(
                                ${(content.focalPoint.x - 0.5) * 100}%,
                                ${(content.focalPoint.y - 0.5) * 100}%
                            )
                        ` : ''}
                    />

                    ${this.isEditing ? html`
                        <div class="overlay">
                            <div class="controls">
                                <label class="control-button">
                                    <span>Upload Image</span>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        @change=${this.handleImageUpload}
                                    />
                                </label>
                                <button 
                                    class="control-button"
                                    @click=${() => this.isEditing = false}
                                >
                                    <span>Done</span>
                                </button>
                            </div>
                        </div>

                        ${content.focalPoint ? html`
                            <div 
                                class="focal-point"
                                style=${`
                                    left: ${content.focalPoint.x * 100}%;
                                    top: ${content.focalPoint.y * 100}%;
                                `}
                                @mousedown=${() => this.isDraggingFocalPoint = true}
                                @mousemove=${this.handleFocalPointDrag}
                                @mouseup=${() => this.isDraggingFocalPoint = false}
                            ></div>
                        ` : null}

                        <div class="resize-handle"></div>
                    ` : html`
                        <div class="overlay" @click=${() => this.isEditing = true}>
                            <span>Click to edit</span>
                        </div>
                    `}

                    ${this.uploadProgress > 0 ? html`
                        <div class="upload-progress">
                            <div 
                                class="upload-progress-bar"
                                style=${`width: ${this.uploadProgress}%`}
                            ></div>
                        </div>
                    ` : null}
                </div>

                ${content.caption ? html`
                    <div class="image-caption
${content.caption ? html`
                    <div class="image-caption" 
                        contenteditable="true"
                        @input=${(e: InputEvent) => {
                        const target = e.target as HTMLElement;
                        this.dispatchEvent(new CustomEvent('block-update', {
                            detail: {
                                ...this.block,
                                content: {
                                    ...content,
                                    caption: target.textContent || ''
                                }
                            },
                            bubbles: true,
                            composed: true
                        }));
                    }}
                    >${content.caption}</div>
                ` : null}
            </div>
        `;
    }

    // Add connected callback for event listeners
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mousemove', this.handleFocalPointDrag.bind(this));
        window.addEventListener('mouseup', () => this.isDraggingFocalPoint = false);
    }

    // Clean up event listeners
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mousemove', this.handleFocalPointDrag.bind(this));
        window.removeEventListener('mouseup', () => this.isDraggingFocalPoint = false);
    }
}