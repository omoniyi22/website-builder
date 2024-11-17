import React, { useMemo } from 'react';
import { Search, Plus, Layout, Type, Image, Video, Code } from 'lucide-react';
import { blockTemplates } from './BlockEditor/blockTemplates';
import { blockCombinations } from './BlockEditor/blockCombination';
import type { BlockCombination } from './BlockEditor/blockCombination';

interface BlockLibraryProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onBlockSelect: (templateId: string) => void;
    onCombinationSelect: (combinationId: string) => void;
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
                                                              searchTerm,
                                                              onSearchChange,
                                                              onBlockSelect,
                                                              onCombinationSelect
                                                          }) => {
    const filteredContent = useMemo(() => {
        const term = searchTerm.toLowerCase();

        if (term.includes('template')) {
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
            return blockCombinations.filter((combination: BlockCombination) =>
                combination.name.toLowerCase().includes(term) ||
                combination.description.toLowerCase().includes(term)
            ).reduce((acc: Record<string, BlockCombination[]>, combination: BlockCombination) => {
                const category = acc[combination.category] || [];
                return {
                    ...acc,
                    [combination.category]: [...category, combination]
                };
            }, {});
        }
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            {Object.entries(filteredContent).map(([category, items]) => (
                <div key={category}>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                        {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {'url' in items[0] ?
                            (items as BlockCombination[]).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onCombinationSelect(item.id)}
                                    className="flex flex-col p-3 text-left border rounded-lg hover:bg-gray-50"
                                >
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <span className="text-xs text-gray-500">{item.description}</span>
                                </button>
                            ))
                            :
                            (items as typeof blockTemplates).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onBlockSelect(item.id)}
                                    className="flex flex-col p-3 text-left border rounded-lg hover:bg-gray-50"
                                >
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <span className="text-xs text-gray-500">{item.description}</span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};