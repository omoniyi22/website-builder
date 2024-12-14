import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block, GalleryBlockContent } from '../../../types';

@customElement('site-gallery-block')
export class GalleryBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private selectedImageIndex = -1;
    @state() private isDragging = false;
    @state() private startX = 0;
    @state() private scrollLeft = 0;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        .gallery {
            position: relative;
            width: 100%;
        }

        .gallery-grid {
            display: grid;
            gap: var(--gallery-gap, 1rem);
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        .gallery-masonry {
            columns: var(--gallery-columns, 3);
            column-gap: var(--gallery-gap, 1rem);
        }

        .gallery-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: var(--gallery-gap, 1rem);
            cursor: grab;
        }

        .gallery-carousel::-webkit-scrollbar {
            display: none;
        }

        .gallery-carousel.dragging {
            cursor: grabbing;
            scroll-behavior: auto;
        }

        .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 0.375rem;
            cursor: pointer;
        }

        .gallery-grid .gallery-item {
            aspect-ratio: var(--gallery-aspect-ratio, 1);
        }

        .gallery-masonry .gallery-item {
            break-inside: avoid;
            margin-bottom: var(--gallery-gap, 1rem);
        }

        .gallery-carousel .gallery-item {
            flex: 0 0 var(--gallery-item-width, 300px);
            scroll-snap-align: start;
        }

        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .gallery-item:hover img {
            transform: scale(1.05);
        }

        .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.5rem;
            background: rgba(0,0,0,0.7);
            color: white;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-caption {
            opacity: 1;
        }

        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }

        .lightbox-image {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
        }

        .lightbox-caption {
            position: absolute;
            bottom: -2rem;
            left: 0;
            right: 0;
            text-align: center;
            color: white;
        }

        .lightbox-controls {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0 2rem;
        }

        .lightbox-button {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            padding: 1rem;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .lightbox-button:hover {
            background: rgba(255,255,255,0.2);
        }

        .gallery-controls {
            position: absolute;
            top: -3rem;
            right: 0;
            display: flex;
            gap: 0.5rem;

            .gallery-controls {
                position: absolute;
                top: -3rem;
                right: 0;
                display: flex;
                gap: 0.5rem;
                background: white;
                padding: 0.5rem;
                border-radius: 0.375rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

            .upload-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.5);
                color: white;
                gap: 1rem;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .gallery-item:hover .upload-overlay {
                opacity: 1;
            }
        `;

    private handleImageUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const files = Array.from(input.files || []);
        
        if (files.length === 0) return;

        const content = this.block.content as GalleryBlockContent;
        const currentImages = content.images || [];

        // Process each file
        Promise.all(
            files.map(file => new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            }))
        ).then(newImages => {
            this.updateGallery({
                images: [
                    ...currentImages,
                    ...newImages.map((url, i) => ({
                        url,
                        alt: files[i].name,
                        caption: '',
                        width: 0,
                        height: 0
                    }))
                ]
            });
        });
    }

    private updateGallery(updates: Partial<GalleryBlockContent>) {
        const content = this.block.content as GalleryBlockContent;
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

    private handleDragStart(e: MouseEvent) {
        const gallery = this.shadowRoot?.querySelector('.gallery-carousel');
        if (!gallery) return;

        this.isDragging = true;
        this.startX = e.pageX - gallery.offsetLeft;
        this.scrollLeft = gallery.scrollLeft;
    }

    private handleDragMove(e: MouseEvent) {
        if (!this.isDragging) return;

        const gallery = this.shadowRoot?.querySelector('.gallery-carousel');
        if (!gallery) return;

        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - this.startX) * 2;
        gallery.scrollLeft = this.scrollLeft - walk;
    }

    private renderGalleryItems(images: GalleryBlockContent['images']) {
        return images.map((image, index) => html`
            <div 
                class="gallery-item"
                @click=${() => this.selectedImageIndex = index}
            >
                <img 
                    src=${image.url} 
                    alt=${image.alt}
                    loading="lazy"
                />
                ${image.caption ? html`
                    <div class="gallery-caption">${image.caption}</div>
                ` : null}
            </div>
        `);
    }

    render() {
        const content = this.block.content as GalleryBlockContent;
        const images = content.images || [];

        return html`
            <div class="gallery">
                <div class="gallery-controls">
                    <button 
                        class="control-button"
                        @click=${() => this.updateGallery({ layout: 'grid' })}
                    >
                        Grid
                    </button>
                    <button 
                        class="control-button"
                        @click=${() => this.updateGallery({ layout: 'masonry' })}
                    >
                        Masonry
                    </button>
                    <button 
                        class="control-button"
                        @click=${() => this.updateGallery({ layout: 'carousel' })}
                    >
                        Carousel
                    </button>
                    <label class="control-button">
                        Add Images
                        <input 
                            type="file"
                            multiple
                            accept="image/*"
                            @change=${this.handleImageUpload}
                            style="display: none"
                        />
                    </label>
                </div>

                <div 
                    class=${`gallery-${content.layout || 'grid'} ${this.isDragging ? 'dragging' : ''}`}
                    @mousedown=${this.handleDragStart}
                    @mousemove=${this.handleDragMove}
                    @mouseup=${() => this.isDragging = false}
                    @mouseleave=${() => this.isDragging = false}
                    style=${`
                        --gallery-columns: ${content.columnCount || 3};
                        --gallery-gap: ${content.gap || 1}rem;
                        --gallery-item-width: ${content.itemWidth || 300}px;
                    `}
                >
                    ${this.renderGalleryItems(images)}
                </div>

                ${this.selectedImageIndex >= 0 ? html`
                    <div 
                        class="lightbox"
                        @click=${() => this.selectedImageIndex = -1}
                    >
                        <div 
                            class="lightbox-content"
                            @click=${(e: Event) => e.stopPropagation()}
                        >
                            <img 
                                class="lightbox-image"
                                src=${images[this.selectedImageIndex].url}
                                alt=${images[this.selectedImageIndex].alt}
                            />
                            ${images[this.selectedImageIndex].caption ? html`
                                <div class="lightbox-caption">
                                    ${images[this.selectedImageIndex].caption}
                                </div>
                            ` : null}
                            <div class="lightbox-controls">
                                <button 
                                    class="lightbox-button"
                                    ?disabled=${this.selectedImageIndex === 0}
                                    @click=${() => this.selectedImageIndex--}
                                >
                                    ←
                                </button>
                                <button 
                                    class="lightbox-button"
                                    ?disabled=${this.selectedImageIndex === images.length - 1}
                                    @click=${() => this.selectedImageIndex++}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                ` : null}
            </div>
        `;
    }
}