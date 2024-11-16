import React, { useState, useEffect } from 'react';
import { Block } from '@/types';
import { Bold, Italic, Link, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextBlockProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(block.content);
    const editorRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && editorRef.current) {
            editorRef.current.focus();
        }
    }, [isEditing]);

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onUpdate({ content: editorRef.current.innerHTML });
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        onUpdate({ content });
    };

    const Toolbar = () => (
        <div className="flex items-center space-x-1 mb-2 bg-gray-50 p-2 rounded">
            <button
                onClick={() => handleFormat('bold')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('italic')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
                onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) handleFormat('createLink', url);
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Insert Link"
            >
                <Link className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('insertUnorderedList')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
                onClick={() => handleFormat('justifyLeft')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('justifyCenter')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('justifyRight')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div
            className={`text-block ${block.settings.width} ${block.settings.alignment}`}
            onClick={() => !isEditing && setIsEditing(true)}
        >
            {isEditing && <Toolbar />}
            <div
                ref={editorRef}
                contentEditable={isEditing}
                onBlur={handleBlur}
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: content }}
                className={`prose max-w-none outline-none ${
                    isEditing ? 'min-h-[100px] border border-gray-200 rounded p-2' : ''
                }`}
                style={{
                    textAlign: block.settings.alignment,
                    padding: block.settings.padding === 'none' ? 0 : undefined,
                }}
            />
        </div>
    );
};