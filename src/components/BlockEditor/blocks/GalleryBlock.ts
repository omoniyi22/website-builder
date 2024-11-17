import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block } from '../../../types';

interface GalleryImage {
    url: string;
    alt: string;
    caption?: string;
    width: number;
    height: number;
}

@customElement('site-gallery-block')
export class GalleryBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private selectedImage: number = -1;
    @state() private layout: 'grid' | 'masonry' | 'carousel' = 'grid';

    static styles = css`
        :host {
            display: block;
        }
        .gallery {
            display: grid;
            gap: 1rem;
            width: 100%;
        }
        .layout-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        .layout-masonry {
            columns: 3;
            column-gap: 1rem;
        }
        .layout-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        .image-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        .layout-masonry .image-wrapper {
            break-inside: avoid;
            margin-bottom: 1rem;
        }
        .layout-carousel .image-wrapper {
            flex: 0 0 300px;
            scroll-snap-align: start;
        }
        img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.3s ease;
        }
        .image-wrapper:hover img {
            transform: scale(1.05);
        }
        .caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .image-wrapper:hover .caption {
            opacity: 1;
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
        .controls {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
        }
        .control-button {
            padding: 0.5rem;
            background: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .control-button:hover {
            opacity: 1;
        }
    `;

    private handleImageClick(index: number) {
        this.selectedImage = index;
    }

    private handleLayoutChange(newLayout: 'grid' | 'masonry' | 'carousel') {
        this.layout = newLayout;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                settings: { ...this.block.settings, layout: newLayout }
            },
            bubbles: true,
            composed: true
        }));
    }

    private renderImages(images: GalleryImage[]) {
        return images.map((image, index) => html`
            <div class="image-wrapper" @click=${() => this.handleImageClick(index)}>
                <img src=${image.url} alt=${image.alt} loading="lazy" />
                ${image.caption ? html`
                    <div class="caption">${image.caption}</div>
                ` : null}
            </div>
        `);
    }

    private renderLightbox(images: GalleryImage[]) {
        if (this.selectedImage === -1) return null;

        const image = images[this.selectedImage];
        return html`
            <div 
                class="lightbox"
                @click=${() => this.selectedImage = -1}
            >
                <img src=${image.url} alt=${image.alt} />
                <div class="controls">
                    ${this.selectedImage > 0 ? html`
                        <button 
                            class="control-button"
                            @click=${(e: Event) => {
            e.stopPropagation();
            this.selectedImage--;
        }}
                        >Previous</button>
                    ` : null}
                    ${this.selectedImage < images.length - 1 ? html`
                        <button 
                            class="control-button"
                            @click=${(e: Event) => {
            e.stopPropagation();
            this.selectedImage++;
        }}
                        >Next</button>
                    ` : null}
                    <button 
                        class="control-button"
                        @click=${(e: Event) => {
            e.stopPropagation();
            this.selectedImage = -1;
        }}
                    >Close</button>
                </div>
            </div>
        `;
    }

    render() {
        const { content: { images = [] } } = this.block;

        return html`
            <div class="gallery-block">
                <div class="controls">
                    <button
                        class="control-button"
                        ?selected=${this.layout === 'grid'}
                        @click=${() => this.handleLayoutChange('grid')}
                    >Grid</button>
                    <button
                        class="control-button"
                        ?selected=${this.layout === 'masonry'}
                        @click=${() => this.handleLayoutChange('masonry')}
                    >Masonry</button>
                    <button
                        class="control-button"
                        ?selected=${this.layout === 'carousel'}
                        @click=${() => this.handleLayoutChange('carousel')}
                    >Carousel</button>
                </div>
                <div class="gallery layout-${this.layout}">
                    ${this.renderImages(images)}
                </div>
                ${this.renderLightbox(images)}
            </div>
        `;
    }
}