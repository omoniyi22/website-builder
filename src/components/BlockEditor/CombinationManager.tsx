import React, { useState } from 'react';
import type { Block } from '../../types';

interface CombinationManagerProps {
    onSave: (combination: {
        name: string;
        description: string;
        category: string;
        blocks: Block[];
    }) => void;
    selectedBlocks: Block[];
    onClose: () => void;
}

export const CombinationManager: React.FC<CombinationManagerProps> = ({
                                                                          onSave,
                                                                          selectedBlocks,
                                                                          onClose
                                                                      }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Custom');

    const handleSave = () => {
        if (!name) return;

        onSave({
            name,
            description,
            category,
            blocks: selectedBlocks
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Save as Combination</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="e.g., My Custom Header"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Describe this combination..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="Custom">Custom</option>
                            <option value="Headers">Headers</option>
                            <option value="Features">Features</option>
                            <option value="Social Proof">Social Proof</option>
                            <option value="Call to Action">Call to Action</option>
                        </select>
                    </div>

                    <div className="font-medium text-sm text-gray-500">
                        {selectedBlocks.length} blocks will be saved in this combination
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Save Combination
                    </button>
                </div>
            </div>
        </div>
    );
};