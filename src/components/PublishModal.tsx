import React from 'react';
import { Site } from '../types';

interface PublishModalProps {
    site: Site;
    isPublishing: boolean;
    onPublish: () => void;
    onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
    site,
    isPublishing,
    onPublish,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Publish Site</h2>
                <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 px-4 py-2 border rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};