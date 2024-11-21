import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';
import { Menu, Search, Globe, Lock, Trash2, Plus } from 'lucide-react';

import { BlockEditor } from './BlockEditor';
import { PageList } from './PageList';
import { ThemeEditor } from './ThemeEditor';
import { PageSettingsEditor } from './PageSettings';
import { PublishModal } from './PublishModal';
import { PreviewFrame } from './PreviewFrame';
import { BlockLibrary } from './BlockLibrary';

import { useToast } from '../hooks/useToast';
import { useSiteData } from '../hooks/useSiteData';
import { useAuth } from '../hooks/useAuth';

import type { Site, Page, Theme, PageSettings } from '../types';
import { createBlocksFromCombination } from './BlockEditor/blockCombination';
import { createBlockFromTemplate } from './BlockEditor/blockTemplates';
import { pageSettingsToPage, pageToPageSettings } from '../types';

// Helper function to convert Page array to PageSettings array
const pagesToPageSettings = (pages: Page[]): PageSettings[] => {
    return pages.map(page => pageToPageSettings(page));
};

// Helper function to convert PageSettings array to Page array
const pageSettingsToPages = (settings: PageSettings[], existingPages: Page[]): Page[] => {
    return settings.map(setting => {
        const existingPage = existingPages.find(p => p.id === setting.id);
        if (existingPage) {
            // Preserve existing page data while updating settings
            return {
                ...existingPage,
                title: setting.title,
                urlPrefix: setting.urlPrefix,
                showInNav: setting.showInNav,
                parentId: setting.parentId,
                isDummy: setting.isDummy,
                order: setting.order,
                children: setting.children,
                headerConfig: setting.headerConfig,
                footerConfig: setting.footerConfig
            };
        }
        // Create new page from settings
        return {
            ...pageSettingsToPage(setting),
            slug: setting.urlPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            content: [],
            isPublished: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });
};

const debouncedSave = debounce((siteData: Site, saveSite: (site: Site) => Promise<void>, toast: any) => {
    saveSite(siteData).then(() => {
        toast({
            title: 'Changes saved',
            type: 'success'
        });
    }).catch((error) => {
        toast({
            title: 'Save failed',
            description: 'Your changes could not be saved. Please try again.',
            type: 'error'
        });
    });
}, 2000);

export const GoogleSitesClone: React.FC = () => {
    // Core state
    const [site, setSite] = useState<Site | null>(null);
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [activeTab, setActiveTab] = useState<'insert' | 'pages' | 'themes'>('insert');
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Undo/Redo state
    const [undoStack, setUndoStack] = useState<Site[]>([]);
    const [redoStack, setRedoStack] = useState<Site[]>([]);

    // Refs
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const lastSavedRef = useRef<string>('');

    // Hooks
    const { toast } = useToast();
    const { user } = useAuth();
    const { getSiteData, saveSite, publishSite } = useSiteData();

    // Memoized handlers
    const memoizedHandlePageSelect = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    const memoizedHandleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    // Initialize site data
    useEffect(() => {
        const loadSite = async () => {
            try {
                const data = await getSiteData();
                setSite(data);
                setCurrentPage(data.pages[0]);
            } catch (error) {
                toast({
                    title: 'Error loading site',
                    description: 'Failed to load site data. Please try again.',
                    type: 'error'
                });
            }
        };
        loadSite();
    }, [getSiteData, toast]);

    // Handle site updates
    const handleSiteUpdate = useCallback((updates: Partial<Site>) => {
        if (!site) return;

        const newSite = { ...site, ...updates };
        setSite(newSite);

        // Debounce the save operation
        debouncedSave(newSite, saveSite, toast);
    }, [site, saveSite, toast]);

// Move handlePageUpdate before handleBlockSelect
    const handlePageUpdate = useCallback((pageId: string, updates: Partial<Page>) => {
        if (!site) return;
        const newPages = site.pages.map(p =>
            p.id === pageId ? { ...p, ...updates } : p
        );
        handleSiteUpdate({
            ...site,
            pages: newPages
        });
    }, [site, handleSiteUpdate]);

    const handleBlockSelect = useCallback((templateId: string) => {
        if (!currentPage) return;
        const newBlock = createBlockFromTemplate(templateId);
        if (!newBlock) return;

        handlePageUpdate(currentPage.id, {
            content: [...(currentPage.content || []), newBlock],
            updatedAt: new Date()
        });
    }, [currentPage, handlePageUpdate]);

    // Handle page settings updates
    const handlePageSettingsUpdate = useCallback((newPageSettings: PageSettings[]) => {
        if (!site) return;

        const updatedPages = pageSettingsToPages(newPageSettings, site.pages);
        handleSiteUpdate({ ...site, pages: updatedPages });
    }, [site, handleSiteUpdate]);

    const handlePageDelete = useCallback((pageId: string) => {
        if (!site) return;
        const confirmed = window.confirm('Are you sure you want to delete this page?');
        if (confirmed) {
            const newPages = site.pages.filter(p => p.id !== pageId);
            handleSiteUpdate({ ...site, pages: newPages });
            if (currentPage?.id === pageId) {
                setCurrentPage(newPages[0] || null);
            }
        }
    }, [site, currentPage, handleSiteUpdate]);

    const handleCombinationSelect = useCallback((combinationId: string) => {
        if (!currentPage) return;
        const newBlocks = createBlocksFromCombination(combinationId);
        if (!newBlocks.length) return;

        handlePageUpdate(currentPage.id, {
            content: [...(currentPage.content || []), ...newBlocks],
            updatedAt: new Date()
        });
    }, [currentPage, handlePageUpdate]);

// Replace the entire handleCreatePage function with this version:
    const handleCreatePage = useCallback(() => {
        console.log("Starting page creation");
        if (!site) {
            console.log("No site available");
            return;
        }

        const now = new Date();
        const pageId = Date.now().toString();

        const newPage: Page = {
            id: pageId,
            title: 'New Page',
            slug: `page-${pageId}`,
            urlPrefix: `page-${pageId}`,
            showInNav: true,
            parentId: null,
            isDummy: false,
            order: site.pages.length,
            children: [],
            headerConfig: {
                enabled: false,
                height: 200
            },
            footerConfig: {
                enabled: false,
                content: ''
            },
            content: [],
            isPublished: false,
            createdAt: now,
            updatedAt: now
        };

        const newPages = [...site.pages, newPage];

        // Update site in a single operation
        const updates = {
            ...site,
            pages: newPages
        };

        setSite(updates);
        setCurrentPage(newPage);
        console.log("Page creation complete");
    }, [site]);  // Only depend on site

    // Publishing
    const handlePublish = async () => {
        if (!site) return;

        setIsPublishing(true);
        try {
            await publishSite(site);
            toast({
                title: 'Site published successfully',
                type: 'success'
            });
        } catch (error) {
            toast({
                title: 'Publishing failed',
                description: 'Could not publish your site. Please try again.',
                type: 'error'
            });
        } finally {
            setIsPublishing(false);
            setShowPublishModal(false);
        }
    };

    // Theme handling
    const handleThemeChange = (theme: Theme) => {
        handleSiteUpdate({ theme });
    };

    // Undo/Redo
    const handleUndo = () => {
        if (undoStack.length === 0) return;

        const prevState = undoStack[undoStack.length - 1];
        const currentState = site;

        setUndoStack(prev => prev.slice(0, -1));
        if (currentState) {
            setRedoStack(prev => [...prev, currentState]);
        }
        setSite(prevState);
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;

        const nextState = redoStack[redoStack.length - 1];
        const currentState = site;

        setRedoStack(prev => prev.slice(0, -1));
        if (currentState) {
            setUndoStack(prev => [...prev, currentState]);
        }
        setSite(nextState);
    };

    if (!site) {
        return <div>Loading...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen bg-white">
                {/* Top Navigation */}
                <div
                    className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-50">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    >
                        <Menu className="w-5 h-5 text-gray-600"/>
                    </button>

                    <input
                        type="text"
                        value={site.name}
                        onChange={(e) => handleSiteUpdate({name: e.target.value})}
                        className="ml-4 px-2 py-1 text-lg font-normal hover:bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Untitled site"
                    />

                    <div className="ml-auto flex items-center space-x-2">
                        <button
                            onClick={() => handleUndo()}
                            disabled={undoStack.length === 0}
                            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                            title="Undo"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                            </svg>
                        </button>

                        <button
                            onClick={() => handleRedo()}
                            disabled={redoStack.length === 0}
                            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                            title="Redo"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
                            </svg>
                        </button>

                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>

                        <button
                            onClick={() => setShowPublishModal(true)}
                            disabled={isPublishing}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isPublishing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4 mr-1"/>
                                    Publish
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Left Sidebar - Pages */}
                <PageList
                    pages={site?.pages || []}
                    currentPage={currentPage}
                    onPageSelect={memoizedHandlePageSelect}
                    onPageUpdate={handlePageUpdate}
                    onCreatePage={() => {
                        if (site) {
                            console.log("Create page clicked");
                            handleCreatePage();
                        }
                    }}
                />

                {/* Main Content Area */}
                <div className="flex-1 ml-64 mt-16">
                    {showPreview ? (
                        <PreviewFrame site={site} currentPage={currentPage}/>
                    ) : (
                        <BlockEditor
                            blocks={currentPage?.content || []}
                            onBlocksChange={(newBlocks) => {
                                if (!currentPage) return;
                                handlePageUpdate(currentPage.id, {
                                    content: newBlocks,
                                    updatedAt: new Date()
                                });
                            }}
                            isDragging={isDragging}
                            onDraggingChange={setIsDragging}
                        />
                    )}
                </div>

                {/* Right Sidebar */}
                <div
                    className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ${
                        rightPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="border-b border-gray-200">
                            <div className="flex p-2 space-x-1">
                                {['insert', 'pages', 'themes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as typeof activeTab)}
                                        className={`flex-1 px-4 py-2 text-sm rounded transition-colors capitalize ${
                                            activeTab === tab ? 'bg-gray-100' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"/>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search blocks and pages"
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded"
                                    />
                                </div>
                            </div>

                            {activeTab === 'insert' && (
                                <BlockLibrary
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    onBlockSelect={handleBlockSelect}
                                    onCombinationSelect={handleCombinationSelect}
                                />
                            )}

                            {activeTab === 'pages' && site && (
                                <PageSettingsEditor
                                    pages={pagesToPageSettings(
                                        site.pages.filter(page =>
                                            page.title.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                    )}
                                    onUpdate={handlePageSettingsUpdate}
                                    onDeletePage={handlePageDelete}
                                    currentPage={currentPage}
                                    onCreatePage={handleCreatePage}
                                    onPageSelect={setCurrentPage}
                                />
                            )}

                            {activeTab === 'themes' && site && (
                                <ThemeEditor
                                    currentTheme={site.theme}
                                    onThemeChange={handleThemeChange}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Publish Modal */}
                {showPublishModal && (
                    <PublishModal
                        site={site}
                        onClose={() => setShowPublishModal(false)}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                    />
                )}

                {/* Toast Container for notifications */}
                <div className="fixed bottom-4 right-4 z-50">
                    {/* Toasts will be rendered here by the toast hook */}
                </div>
            </div>
        </DndProvider>
    );
};