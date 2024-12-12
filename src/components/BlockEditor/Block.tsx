import React from 'react';
import type { BlockCombination } from './blockCombination';

interface CombinationPreviewProps {
    combination: BlockCombination;
    onApply: () => void;
    onClose: () => void;
}

export const CombinationPreview: React.FC<CombinationPreviewProps> = ({
    combination,
    onApply,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{combination.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{combination.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        ×
                    </button>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                    <div
                        className="w-full aspect-video bg-gray-100 rounded-lg"
                        dangerouslySetInnerHTML={{
                            __html: combination.previewImage || ''
                        }}
                    />
                </div>

                <div className="border-t pt-4">
                    <div className="text-sm text-gray-500 mb-4">
                        Contains {combination.blocks.length} blocks
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onApply}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Insert Combination
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};