import React, { useState, useCallback } from 'react';
import type { Page, PageSettings } from '../../types';
import { FileText, ChevronRight, ChevronDown, Globe, Eye, EyeOff, Link } from 'lucide-react';

interface PageSettingsEditorProps {
    pages: PageSettings[];
    onUpdate: (pages: PageSettings[]) => void;
    onDeletePage: (pageId: string) => void;
    currentPage?: Page | null;
    onCreatePage?: () => void;
    onPageSelect?: (page: Page) => void;
}

export const PageSettingsEditor: React.FC<PageSettingsEditorProps> = ({
    pages,
    onUpdate,
    onDeletePage,
    currentPage,
    onCreatePage,
    onPageSelect
}) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (pageId: string) => {
        setDraggedItem(pageId);
    };

    const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        const draggedPage = pages.find(p => p.id === draggedItem);
        const targetPage = pages.find(p => p.id === targetId);

        if (!draggedPage || !targetPage) return;

        // Prevent nesting under itself or its children
        if (isDescendant(draggedPage, targetPage, pages)) return;

        const dropPosition = getDropPosition(e, targetId);
        const newPages = reorderPages(pages, draggedItem, targetId, dropPosition);
        onUpdate(newPages);
    }, [draggedItem, pages, onUpdate]);

    const isDescendant = (parent: PageSettings, child: PageSettings, pageList: PageSettings[]): boolean => {
        if (parent.id === child.id) return true;
        return child.children.some(childId => {
            const childPage = pageList.find(p => p.id === childId);
            return childPage ? isDescendant(parent, childPage, pageList) : false;
        });
    };

    const getDropPosition = (e: React.DragEvent, targetId: string): 'before' | 'after' | 'inside' => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const y = e.clientY - rect.top;

        if (y < rect.height * 0.25) return 'before';
        if (y > rect.height * 0.75) return 'after';
        return 'inside';
    };

    const reorderPages = (
        pageList: PageSettings[],
        draggedId: string,
        targetId: string,
        position: 'before' | 'after' | 'inside'
    ): PageSettings[] => {
        const newPages = [...pageList];
        const draggedPage = newPages.find(p => p.id === draggedId)!;
        const targetPage = newPages.find(p => p.id === targetId)!;

        // Remove from old position
        if (draggedPage.parentId) {
            const oldParent = newPages.find(p => p.id === draggedPage.parentId)!;
            oldParent.children = oldParent.children.filter(id => id !== draggedId);
        }

        // Add to new position
        if (position === 'inside') {
            draggedPage.parentId = targetId;
            targetPage.children.push(draggedId);
        } else {
            const targetParentId = targetPage.parentId;
            const siblings = targetParentId
                ? newPages.find(p => p.id === targetParentId)!.children
                : newPages.filter(p => !p.parentId).map(p => p.id);

            const targetIndex = siblings.indexOf(targetId);
            const newIndex = position === 'before' ? targetIndex : targetIndex + 1;

            draggedPage.parentId = targetParentId;
            if (targetParentId) {
                const parent = newPages.find(p => p.id === targetParentId)!;
                parent.children.splice(newIndex, 0, draggedId);
            }
        }

        return newPages;
    };

    const renderPageItem = (page: PageSettings, level = 0) => {
        const hasChildren = page.children.length > 0;
        const isExpanded = expandedItems.has(page.id);

        return (
            <div key={page.id}>
                <div
                    draggable
                    onDragStart={() => handleDragStart(page.id)}
                    onDragOver={(e) => handleDragOver(e, page.id)}
                    className={`
            flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
            ${draggedItem === page.id ? 'opacity-50' : ''}
          `}
                >
                    <button
                        onClick={() => {
                            setExpandedItems(prev => {
                                const next = new Set(prev);
                                if (next.has(page.id)) {
                                    next.delete(page.id);
                                } else {
                                    next.add(page.id);
                                }
                                return next;
                            });
                        }}
                        className={`mr-2 ${!hasChildren ? 'invisible' : ''}`}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>

                    <FileText className={`w-4 h-4 mr-2 ${page.isDummy ? 'text-gray-400' : ''}`} />

                    <div className="flex-1">
                        <input
                            type="text"
                            value={page.title}
                            onChange={e => {
                                const newPages = pages.map(p =>
                                    p.id === page.id ? { ...p, title: e.target.value } : p
                                );
                                onUpdate(newPages);
                            }}
                            className="w-full px-2 py-1 text-sm border rounded"
                        />
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                        <button
                            onClick={() => {
                                const newPages = pages.map(p =>
                                    p.id === page.id ? { ...p, showInNav: !p.showInNav } : p
                                );
                                onUpdate(newPages);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            {page.showInNav ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                        </button>

                        <button
                            onClick={() => {
                                const newPages = pages.map(p =>
                                    p.id === page.id ? { ...p, isDummy: !p.isDummy } : p
                                );
                                onUpdate(newPages);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <Link className={`w-4 h-4 ${page.isDummy ? 'text-blue-500' : 'text-gray-400'}`} />
                        </button>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="ml-6">
                        {page.children.map(childId => {
                            const childPage = pages.find(p => p.id === childId);
                            if (!childPage) return null;
                            return renderPageItem(childPage, level + 1);
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="border rounded-lg bg-white shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Page Settings</h2>
            </div>

            <div className="p-4 space-y-4">
                {pages.filter(page => !page.parentId).map(page => renderPageItem(page))}
            </div>
        </div>
    );
};