import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Block, BlockSettings as IBlockSettings, BlockSettingsUpdate } from '../../types';

@customElement('block-settings-panel')
export class BlockSettingsPanel extends LitElement {
    @property({ type: Object }) block!: Block;

    static styles = css`
        :host {
            display: block;
            background: white;
            border-left: 1px solid #e5e7eb;
            width: 300px;
            padding: 1rem;
        }
        .section {
            margin-bottom: 1.5rem;
        }
        .section-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
        }
        .option-group {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        button {
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
            background: white;
            cursor: pointer;
        }
        button[selected] {
            border-color: #3b82f6;
            background: #eff6ff;
            color: #3b82f6;
        }
        .input-group {
            margin-bottom: 0.5rem;
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
    `;

    private updateSettings(updates: BlockSettingsUpdate) {
        this.dispatchEvent(new CustomEvent('settings-update', {
            detail: {
                ...this.block,
                settings: { ...this.block.settings, ...updates }
            },
            bubbles: true,
            composed: true
        }));
    }

    private isTextBlock(): boolean {
        return this.block.type === 'text' || this.block.type === 'heading';
    }

    private renderTextSettings() {
        if (!this.isTextBlock()) return null;

        const currentFontSize = this.block.settings.fontSize || 'normal';

        return html`
            <div class="section">
                <div class="section-title">Typography</div>
                <div class="option-group">
                    <button
                            ?selected=${currentFontSize === 'small'}
                            @click=${() => this.updateSettings({ fontSize: 'small' })}
                    >Small</button>
                    <button
                            ?selected=${currentFontSize === 'normal'}
                            @click=${() => this.updateSettings({ fontSize: 'normal' })}
                    >Normal</button>
                    <button
                            ?selected=${currentFontSize === 'large'}
                            @click=${() => this.updateSettings({ fontSize: 'large' })}
                    >Large</button>
                </div>

                <div class="option-group">
                    <button
                            ?selected=${this.block.settings.fontWeight === 'normal'}
                            @click=${() => this.updateSettings({ fontWeight: 'normal' })}
                    >Regular</button>
                    <button
                            ?selected=${this.block.settings.fontWeight === 'medium'}
                            @click=${() => this.updateSettings({ fontWeight: 'medium' })}
                    >Medium</button>
                    <button
                            ?selected=${this.block.settings.fontWeight === 'bold'}
                            @click=${() => this.updateSettings({ fontWeight: 'bold' })}
                    >Bold</button>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <div class="settings-panel">
                <div class="section">
                    <div class="section-title">Layout</div>
                    <div class="option-group">
                        <button
                                ?selected=${this.block.settings.width === 'normal'}
                                @click=${() => this.updateSettings({ width: 'normal' })}
                        >Normal</button>
                        <button
                                ?selected=${this.block.settings.width === 'wide'}
                                @click=${() => this.updateSettings({ width: 'wide' })}
                        >Wide</button>
                        <button
                                ?selected=${this.block.settings.width === 'full'}
                                @click=${() => this.updateSettings({ width: 'full' })}
                        >Full</button>
                    </div>

                    <div class="option-group">
                        <button
                                ?selected=${this.block.settings.alignment === 'left'}
                                @click=${() => this.updateSettings({ alignment: 'left' })}
                        >Left</button>
                        <button
                                ?selected=${this.block.settings.alignment === 'center'}
                                @click=${() => this.updateSettings({ alignment: 'center' })}
                        >Center</button>
                        <button
                                ?selected=${this.block.settings.alignment === 'right'}
                                @click=${() => this.updateSettings({ alignment: 'right' })}
                        >Right</button>
                    </div>
                </div>

                ${this.renderTextSettings()}
            </div>
        `;
    }
}