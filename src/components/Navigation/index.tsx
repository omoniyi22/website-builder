import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import type { Page } from '../../types';

interface NavigationProps {
    pages: Page[];
    currentPage: Page | null;
    onPageSelect: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
                                                          pages,
                                                          currentPage,
                                                          onPageSelect,
                                                      }) => {
    const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

    // Build navigation tree
    const buildNavTree = (parentId: string | null = null): Page[] => {
        return pages
            .filter(page => page.parentId === parentId && page.showInNav)
            .sort((a, b) => a.order - b.order);
    };

    // Render dropdown menu
    const renderDropdown = (parentPage: Page) => {
        const children = buildNavTree(parentPage.id);

        if (children.length === 0) return null;

        return (
            <div
                className={`
          absolute top-full left-0 min-w-[200px] bg-white shadow-lg rounded-lg py-2
          transform transition-all duration-200 ease-in-out
          ${hoveredDropdown === parentPage.id ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
            >
                {children.map(child => (
                    <div key={child.id} className="relative group">
                        <button
                            onClick={() => !child.isDummy && onPageSelect(child)}
                            onMouseEnter={() => setHoveredDropdown(child.id)}
                            className={`
                w-full px-4 py-2 text-sm text-left flex items-center justify-between
                ${child.isDummy ? 'text-gray-400' : 'hover:bg-gray-50'}
                ${currentPage?.id === child.id ? 'bg-blue-50 text-blue-600' : ''}
              `}
                        >
                            <span>{child.title}</span>
                            {buildNavTree(child.id).length > 0 && (
                                <ChevronDown className="w-4 h-4 transform -rotate-90" />
                            )}
                        </button>

                        {/* Nested dropdown */}
                        <div
                            className={`
                absolute top-0 left-full ml-1 transform transition-all duration-200
                ${hoveredDropdown === child.id ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
                        >
                            {renderDropdown(child)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render top-level navigation
    const renderTopNav = () => {
        const topLevelPages = buildNavTree(null);

        return (
            <div className="flex items-center space-x-2">
                {topLevelPages.map(page => (
                    <div
                        key={page.id}
                        className="relative"
                        onMouseEnter={() => setHoveredDropdown(page.id)}
                        onMouseLeave={() => setHoveredDropdown(null)}
                    >
                        <button
                            onClick={() => !page.isDummy && onPageSelect(page)}
                            className={`
                px-3 py-2 text-sm rounded-md flex items-center space-x-1
                ${page.isDummy ? 'text-gray-400' : 'hover:bg-gray-50'}
                ${currentPage?.id === page.id ? 'bg-blue-50 text-blue-600' : ''}
              `}
                        >
                            <span>{page.title}</span>
                            {buildNavTree(page.id).length > 0 && (
                                <ChevronDown className="w-4 h-4" />
                            )}
                            {page.isPublished && (
                                <Globe className="w-3 h-3 text-green-500 ml-1" />
                            )}
                        </button>
                        {/* Dropdown menu */}
                        {renderDropdown(page)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <nav className="h-16 border-b border-gray-200 flex items-center px-4">
            {renderTopNav()}
        </nav>
    );
};