import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block } from '../../../types';
import type { ThemeSettings } from '../../ThemeEditor/themeSystem';

interface ImageBlockContent {
    url: string;
    alt: string;
    caption?: string;
    focalPoint: { x: number; y: number };
    aspectRatio: '1:1' | '4:3' | '16:9' | 'original';
    style: {
        borderRadius: 'none' | 'small' | 'medium' | 'large';
        shadow: 'none' | 'small' | 'medium' | 'large';
        padding: 'none' | 'small' | 'medium' | 'large';
    };
    overlay?: {
        enabled: boolean;
        color: string;
        opacity: number;
    };
    lightbox: boolean;
    lazy: boolean;
    responsive: {
        mobile: { width: number; scale: number };
        tablet: { width: number; scale: number };
        desktop: { width: number; scale: number };
    };
}

@customElement('site-image-block')
export class ImageBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @property({ type: Object }) theme!: ThemeSettings;
    @state() private isEditing = false;
    @state() private isDragging = false;
    @state() private dragStart = { x: 0, y: 0 };
    @state() private showLightbox = false;

    static styles = css`
        :host {
            display: block;
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
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            transition: background-color 0.3s ease;
        }
        .controls {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        :host(:hover) .controls {
            opacity: 1;
        }
        .control-button {
            padding: 0.5rem;
            background: var(--theme-background-primary);
            border: none;
            border-radius: var(--theme-border-radius-medium);
            box-shadow: var(--theme-shadow-medium);
            cursor: pointer;
            color: var(--theme-text-primary);
        }
        .control-button:hover {
            background: var(--theme-background-secondary);
        }
        .caption {
            margin-top: 0.5rem;
            font-size: var(--theme-body-size);
            color: var(--theme-text-secondary);
            text-align: center;
        }
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .lightbox img {
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
        }
    `;

    private handleImageLoad(e: Event) {
        const img = e.target as HTMLImageElement;
        if (this.block.content.aspectRatio !== 'original') {
            const [width, height] = this.block.content.aspectRatio.split(':').map(Number);
            const containerWidth = this.offsetWidth;
            const containerHeight = (containerWidth * height) / width;
            img.style.height = `${containerHeight}px`;
        }
    }

    private handleDragStart(e: MouseEvent) {
        this.isDragging = true;
        this.dragStart = {
            x: e.clientX - (this.block.content as ImageBlockContent).focalPoint.x,
            y: e.clientY - (this.block.content as ImageBlockContent).focalPoint.y
        };
    }

    private handleDragMove(e: MouseEvent) {
        if (!this.isDragging) return;

        const rect = this.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - this.dragStart.x) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - this.dragStart.y) / rect.height));

        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...this.block.content,
                    focalPoint: { x, y }
                }
            }
        }));
    }

    render() {
        const content = this.block.content as ImageBlockContent;

        return html`
            <div 
                class="image-container"
                style="
                    border-radius: var(--theme-border-radius-${content.style.borderRadius});
                    box-shadow: var(--theme-shadow-${content.style.shadow});
                    padding: var(--theme-block-padding-${content.style.padding});
                "
            >
                <div 
                    class="image-wrapper"
                    @mousedown=${this.handleDragStart}
                    @mousemove=${this.handleDragMove}
                    @mouseup=${() => this.isDragging = false}
                    @mouseleave=${() => this.isDragging = false}
                >
                    <img
                        src=${content.url}
                        alt=${content.alt}
                        loading=${content.lazy ? 'lazy' : 'eager'}
                        @load=${this.handleImageLoad}
                        style="
                            transform: scale(1.1) translate(
                                ${(content.focalPoint.x - 0.5) * 100}%,
                                ${(content.focalPoint.y - 0.5) * 100}%
                            );
                        "
                        @click=${() => content.lightbox && (this.showLightbox = true)}
                    />
                    ${content.overlay?.enabled ? html`
                        <div 
                            class="overlay"
                            style="
                                background-color: ${content.overlay.color};
                                opacity: ${content.overlay.opacity};
                            "
                        ></div>
                    ` : ''}

                    <div class="controls">
                        <button
                            class="control-button"
                            @click=${() => this.isEditing = true}
                            title="Edit image"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <path d="M12.1 3.9l-7 7-1.2-1.2 7-7 1.2 1.2zM4.5 11.5L3 13l-.5-2 2-.5z"/>
                            </svg>
                        </button>
                        ${content.lightbox ? html`
                            <button
                                class="control-button"
                                @click=${() => this.showLightbox = true}
                                title="View full size"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M2 2v4h2V4h2V2H2zm8 0v2h2v2h2V2h-4zm2 10h-2v2h4v-4h-2v2zM4 12H2v4h4v-2H4v-2z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                </div>

                ${content.caption ? html`
                    <div class="caption">${content.caption}</div>
                ` : ''}
            </div>

            ${this.showLightbox ? html`
                <div 
                    class="lightbox"
                    @click=${() => this.showLightbox = false}
                >
                    <img src=${content.url} alt=${content.alt} />
                </div>
            ` : ''}
        `;
    }
}