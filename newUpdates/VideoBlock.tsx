import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block, VideoBlockContent } from '../../../types';

@customElement('site-video-block')
export class VideoBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private isUploading = false;
    @state() private uploadProgress = 0;
    @state() private error: string | null = null;

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        .video-wrapper {
            position: relative;
            width: 100%;
            background: var(--theme-background-secondary);
            border-radius: 0.375rem;
            overflow: hidden;
        }

        .aspect-ratio {
            position: relative;
            width: 100%;
        }

        .aspect-ratio[data-ratio="16:9"] {
            padding-top: 56.25%;
        }

        .aspect-ratio[data-ratio="4:3"] {
            padding-top: 75%;
        }

        .aspect-ratio[data-ratio="1:1"] {
            padding-top: 100%;
        }

        .video-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        iframe, video {
            width: 100%;
            height: 100%;
            border: none;
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
        }

        .progress-bar {
            width: 80%;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
        }

        .progress-fill {
            height: 100%;
            background: var(--theme-primary);
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .video-controls {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;
            background: white;
            border-radius: 0.375rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            opacity: 0;
            transition: opacity 0.2s;
        }

        :host(:hover) .video-controls {
            opacity: 1;
        }

        .error-message {
            color: var(--theme-error);
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }

        .settings-panel {
            position: absolute;
            top: -100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            border-radius: 0.375rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 100;
            transform: translateY(-1rem);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        :host([editing]) .settings-panel {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
    `;

    private getVideoId(url: string): string | null {
        // YouTube
        const ytMatch = url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        );
        if (ytMatch) return ytMatch[1];

        // Vimeo
        const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
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

    private handleFileUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            this.error = 'Please upload a valid video file';
            return;
        }

        this.isUploading = true;
        this.uploadProgress = 0;

        // Simulate upload progress
        const interval = setInterval(() => {
            this.uploadProgress += 10;
            if (this.uploadProgress >= 100) {
                clearInterval(interval);
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.updateVideo({
                        type: 'file',
                        url: e.target?.result as string,
                        fileName: file.name
                    });
                    this.isUploading = false;
                };
                reader.readAsDataURL(file);
            }
        }, 200);
    }

    private updateVideo(updates: Partial<VideoBlockContent>) {
        const content = this.block.content as VideoBlockContent;
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

    render() {
        const content = this.block.content as VideoBlockContent;

        return html`
            <div class="video-wrapper">
                <div class="aspect-ratio" data-ratio=${content.aspectRatio || '16:9'}>
                    <div class="video-container">
                        ${content.type === 'embed' ? html`
                            <iframe
                                src=${content.url}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        ` : content.type === 'file' ? html`
                            <video
                                src=${content.url}
                                controls=${content.controls}
                                autoplay=${content.autoplay}
                                loop=${content.loop}
                                muted=${content.muted}
                            ></video>
                        ` : html`
                            <div class="upload-overlay">
                                <span>Drop a video file or paste a YouTube/Vimeo URL</span>
                                <input 
                                    type="file" 
                                    accept="video/*"
                                    @change=${this.handleFileUpload}
                                />
                            </div>
                        `}

                        ${this.isUploading ? html`
                            <div class="upload-overlay">
                                <span>Uploading video...</span>
                                <div class="progress-bar">
                                    <div 
                                        class="progress-fill"
                                        style=${`width: ${this.uploadProgress}%`}
                                    ></div>
                                </div>
                            </div>
                        ` : null}
                    </div>
                </div>

                <div class="video-controls">
                    <button 
                        @click=${() => this.isEditing = !this.isEditing}
                        class="control-button"
                    >
                        Settings
                    </button>
                </div>

                ${this.error ? html`
                    <div class="error-message">${this.error}</div>
                ` : null}
            </div>

            <div class="settings-panel">
                <label>
                    Video URL
                    <input
                        type="text"
                        .value=${content.url || ''}
                        @input=${(e: InputEvent) => {
                            const input = e.target as HTMLInputElement;
                            const embedUrl = this.getEmbedUrl(input.value);
                            if (embedUrl) {
                                this.updateVideo({
                                    type: 'embed',
                                    url: embedUrl,
                                    originalUrl: input.value
                                });
                                this.error = null;
                            } else {
                                this.error = 'Invalid video URL';
                            }
                        }}
                    />
                </label>

                <label>
                    Aspect Ratio
                    <select
                        .value=${content.aspectRatio || '16:9'}
                        @change=${(e: Event) => {
                            const select = e.target as HTMLSelectElement;
                            this.updateVideo({ aspectRatio: select.value as '16:9' | '4:3' | '1:1' });
                        }}
                    >
                        <option value="16:9">16:9</option>
                        <option value="4:3">4:3</option>
                        <option value="1:1">1:1</option>
                    </select>
                </label>

                <div class="checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            .checked=${content.autoplay || false}
                            @change=${(e: Event) => {
                                const checkbox = e.target as HTMLInputElement;
                                this.updateVideo({ autoplay: checkbox.checked });
                            }}
                        />
                        Autoplay
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            .checked=${content.controls || true}
                            @change=${(e: Event) => {
                                const checkbox = e.target as HTMLInputElement;
                                this.updateVideo({ controls: checkbox.checked });
                            }}
                        />
                        Show Controls
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            .checked=${content.loop || false}
                            @change=${(e: Event) => {
                                const checkbox = e.target as HTMLInputElement;
                                this.updateVideo({ loop: checkbox.checked });
                            }}
                        />
                        Loop
                    </label>
                </div>
            </div>
        `;
    }
}