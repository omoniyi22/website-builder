import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block } from '../../../types';

@customElement('site-video-block')
export class VideoBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private error: string | null = null;

    static styles = css`
        :host {
            display: block;
        }
        .video-wrapper {
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        .video-wrapper iframe,
        .video-wrapper video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0.375rem;
        }
        .video-editor {
            padding: 1rem;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
        }
        .input-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            font-size: 0.875rem;
            color: #4b5563;
            margin-bottom: 0.25rem;
        }
        input, select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
        }
        .error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .controls {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        button {
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        button:hover {
            background: #e5e7eb;
        }
    `;

    private getVideoId(url: string): string | null {
        // YouTube
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch) return ytMatch[1];

        // Vimeo
        const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
        if (vimeoMatch) return vimeoMatch[1];

        return null;
    }

    private getEmbedUrl(url: string): string | null {
        const videoId = this.getVideoId(url);
        if (!videoId) return null;

        if (url.includes('youtube')) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('vimeo')) {
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return null;
    }

    private handleUrlChange(url: string) {
        const embedUrl = this.getEmbedUrl(url);
        if (!embedUrl) {
            this.error = 'Invalid video URL. Please use YouTube or Vimeo links.';
            return;
        }

        this.error = null;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: {
                ...this.block,
                content: {
                    ...this.block.content,
                    url: embedUrl,
                    originalUrl: url
                }
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.isEditing) {
            return html`
                <div class="video-editor">
                    <div class="input-group">
                        <label>Video URL</label>
                        <input
                            type="text"
                            .value=${this.block.content.originalUrl || ''}
                            @input=${(e: InputEvent) => {
                const input = e.target as HTMLInputElement;
                this.handleUrlChange(input.value);
            }}
                            placeholder="Enter YouTube or Vimeo URL"
                        />
                        ${this.error ? html`<div class="error">${this.error}</div>` : null}
                    </div>
                    <div class="input-group">
                        <label>Aspect Ratio</label>
                        <select
                            .value=${this.block.content.aspectRatio || '16:9'}
                            @change=${(e: Event) => {
                const select = e.target as HTMLSelectElement;
                this.dispatchEvent(new CustomEvent('block-update', {
                    detail: {
                        ...this.block,
                        content: {
                            ...this.block.content,
                            aspectRatio: select.value
                        }
                    }
                }));
            }}
                        >
                            <option value="16:9">16:9</option>
                            <option value="4:3">4:3</option>
                            <option value="1:1">1:1</option>
                        </select>
                    </div>
                    <div class="controls">
                        <button @click=${() => this.isEditing = false}>Done</button>
                    </div>
                </div>
            `;
        }

        return html`
            <div 
                class="video-wrapper"
                style=${this.block.content.aspectRatio === '4:3' ? 'padding-top: 75%;' :
            this.block.content.aspectRatio === '1:1' ? 'padding-top: 100%;' :
                'padding-top: 56.25%;'}
            >
                <iframe
                    src=${this.block.content.url}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    @click=${() => this.isEditing = true}
                ></iframe>
            </div>
        `;
    }
}