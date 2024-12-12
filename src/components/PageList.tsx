import React from 'react';
import { FileText, Plus } from 'lucide-react';
import type { Page } from '../types';

interface PageListProps {
    pages: Page[];
    currentPage: Page | null;
    onPageSelect: (page: Page) => void;
    onPageUpdate: (pageId: string, updates: Partial<Page>) => void;
    onCreatePage: () => void;
}

export const PageList: React.FC<PageListProps> = ({
    pages,
    currentPage,
    onPageSelect,
    onPageUpdate,
    onCreatePage
}) => {
    return (
        <div className="fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 bg-white">
            <div className="p-4">
                <button
                    onClick={() => onCreatePage()}  // Make sure to call it as a function
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add page</span>
                </button>
            </div>

            <div className="px-2">
                {pages.map(page => (
                    <div
                        key={page.id}
                        onClick={() => onPageSelect(page)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded cursor-pointer ${currentPage?.id === page.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{page.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};