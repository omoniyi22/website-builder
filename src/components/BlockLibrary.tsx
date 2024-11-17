import React, { useState, useMemo } from 'react';
import { Search, Plus, Layout, Type, Image, Video, Code } from 'lucide-react';
import { blockTemplates } from './BlockEditor/blockTemplates';
import { blockCombination } from './BlockEditor/blockCombination';

interface BlockLibraryProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onBlockSelect: (templateId: string) => void;
    onCombinationSelect: (combinationId: string) => void;
}

type LibraryTab = 'blocks' | 'combinations';

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
                                                              searchTerm,
                                                              onSearchChange,
                                                              onBlockSelect,
                                                              onCombinationSelect
                                                          }) => {
    const [activeTab, setActiveTab] = useState<LibraryTab>('blocks');

    const filteredContent = useMemo(() => {
        const term = searchTerm.toLowerCase();

        if (activeTab === 'blocks') {
            return blockTemplates.filter(template =>
                template.name.toLowerCase().includes(term) ||
                template.description.toLowerCase().includes(term)
            ).reduce((acc, template) => {
                const category = acc[template.category] || [];
                return {
                    ...acc,
                    [template.category]: [...category, template]
                };
            }, {} as Record<string, typeof blockTemplates>);
        } else {
            return blockCombination.filter(combination =>
                combination.name.toLowerCase().includes(term) ||
                combination.description.toLowerCase().includes(term)
            ).reduce((acc, combination) => {
                const category = acc[combination.category] || [];
                return {
                    ...acc,
                    [combination.category]: [...category, combination]
                };
            }, {} as Record<string, typeof blockCombination>);
        }
    }, [activeTab, searchTerm]);

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                        activeTab === 'blocks'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('blocks')}
                >
                    Blocks
                </button>
                <button
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                        activeTab === 'combinations'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('combinations')}
                >
                    Combinations
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {Object.entries(filteredContent).map(([category, items]) => (
                    <div key={category} className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (activeTab === 'blocks') {
                                            onBlockSelect(item.id);
                                        } else {
                                            onCombinationSelect(item.id);
                                        }
                                    }}
                                    className="flex flex-col p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {/* Preview thumbnail if available */}
                                    {'thumbnail' in item && item.thumbnail && (
                                        <div className="w-full aspect-video bg-gray-100 rounded mb-2">
                                            <img
                                                src={item.thumbnail}
                                                alt=""
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    )}

                                    <div className="font-medium text-sm mb-1">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};