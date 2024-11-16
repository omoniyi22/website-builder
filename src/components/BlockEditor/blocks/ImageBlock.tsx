import React, { useState } from 'react';
import { Block } from '../../../types';
import { Image as ImageIcon, Upload, Edit2, Trash2 } from 'lucide-react';

interface ImageBlockProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
}

interface ImageContent {
    url: string;
    caption: string;
    altText: string;
    width?: number;
    height?: number;
}

interface UploadResponse {
    url: string;
    // Add other response fields if needed
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ block, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const content = block.content as ImageContent;

    const handleImageUpload = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json() as UploadResponse;

            // Get image dimensions
            const img = new Image();
            img.src = data.url;
            const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                img.onload = () => {
                    resolve({
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    });
                };
                img.onerror = () => reject(new Error('Failed to load image dimensions'));
            });

            onUpdate({
                content: {
                    url: data.url,
                    caption: content?.caption || '',
                    altText: content?.altText || file.name,
                    width: dimensions.width,
                    height: dimensions.height,
                },
            });
        } catch (error) {
            // Properly type the error
            if (error instanceof Error) {
                setError(error.message);
            } else if (typeof error === 'string') {
                setError(error);
            } else {
                setError('Failed to upload image');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await handleImageUpload(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageUpload(file);
        }
    };

    if (!content?.url) {
        return (
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`image-upload-${block.id}`}
                />
                <label
                    htmlFor={`image-upload-${block.id}`}
                    className="cursor-pointer flex flex-col items-center"
                >
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
            {loading ? 'Uploading...' : 'Drop an image here or click to upload'}
          </span>
                    {error && (
                        <span className="text-sm text-red-500 mt-2">{error}</span>
                    )}
                </label>
            </div>
        );
    }

    // Rest of the component remains the same...
    return (
        <div className="relative group">
            {/* ... existing JSX ... */}
        </div>
    );
};