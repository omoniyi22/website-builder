import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Type, Image, FileText, Grid, ChevronRight, Plus, Menu, Search,
    Globe, Lock, Trash2
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';
import { BlockEditor } from './BlockEditor';
import { PageList } from './PageList';
import { ThemeEditor } from './ThemeEditor';
import { SiteSettings } from './SiteSettings';
import { PageSettingsEditor } from './PageSettings';
import { PublishModal } from './PublishModal';
import { PreviewFrame } from './PreviewFrame';
import { BlockLibrary } from './BlockLibrary';
import { useToast } from '../hooks/useToast';
import { useSiteData } from '../hooks/useSiteData';
import { useAuth } from '../hooks/useAuth';
import type { Site, Page, Theme } from '../types';
import type { Block } from '../types/blocks';

interface Props {} // Add props if needed

const GoogleSitesClone: React.FC<Props> = () => {
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
    const [undoStack, setUndoStack] = useState<Site[]>([]);
    const [redoStack, setRedoStack] = useState<Site[]>([]);

    // Refs
    const saveTimeoutRef = useRef<NodeJS.Timeout>();
    const lastSavedRef = useRef<string>('');

    // Hooks
    const { toast } = useToast();
    const { user } = useAuth();
    const { saveSite, publishSite, getSiteData } = useSiteData();

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
    }, []);

    // Auto-save functionality
    const debouncedSave = useCallback(
        debounce(async (siteData: Site) => {
            try {
                const siteJson = JSON.stringify(siteData);
                if (siteJson === lastSavedRef.current) return;

                await saveSite(siteData);
                lastSavedRef.current = siteJson;
                toast({
                    title: 'Changes saved',
                    type: 'success'
                });
            } catch (error) {
                toast({
                    title: 'Save failed',
                    description: 'Your changes could not be saved. Please try again.',
                    type: 'error'
                });
            }
        }, 2000),
        []
    );

    // Update handlers
    const handleSiteUpdate = (updates: Partial<Site>) => {
        if (!site) return;

        // Save current state for undo
        setUndoStack(prev => [...prev, site]);
        setRedoStack([]);

        const newSite = { ...site, ...updates };
        setSite(newSite);
        debouncedSave(newSite);
    };

    const handlePageUpdate = (pageId: string, updates: Partial<Page>) => {
        if (!site) return;

        const newPages = site.pages.map((page: Page) =>
            page.id === pageId ? { ...page, ...updates } : page
        );

        handleSiteUpdate({ pages: newPages });
    };

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
                    pages={site.pages}
                    currentPage={currentPage}
                    onPageSelect={setCurrentPage}
                    onPageUpdate={handlePageUpdate}
                    onCreatePage={() => {
                        const newPage: Page = {
                            id: Date.now().toString(),
                            title: 'New Page',
                            slug: `page-${Date.now()}`,
                            content: [],
                            isPublished: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            order: site?.pages?.length || 0 // Use optional chaining and provide a default value
                        };
                        handleSiteUpdate({
                            pages: [...(site?.pages || []), newPage] // Use optional chaining and provide a default empty array
                        });
                        setCurrentPage(newPage);
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
                    }`}>
                    <div className="border-b border-gray-200">
                        <div className="flex p-2 space-x-1">
                            {['insert', 'pages', 'themes'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as 'insert' | 'pages' | 'themes')}
                                    className={`flex-1 px-4 py-2 text-sm rounded transition-colors capitalize ${
                                        activeTab === tab ? 'bg-gray-100' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="relative mb-4">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"/>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search blocks and pages"
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {activeTab === 'insert' && (
                            <BlockLibrary
                                searchTerm={searchTerm}
                                onBlockSelect={(blockType) => {
                                    if (!currentPage) return;
                                    const newBlock: Block = {
                                        id: Date.now().toString(),
                                        type: blockType,
                                        content: '',
                                        settings: {
                                            width: 'normal',
                                            alignment: 'left',
                                            padding: 'normal'
                                        }
                                    };
                                    handlePageUpdate(currentPage.id, {
                                        content: [...(currentPage.content || []), newBlock],
                                        updatedAt: new Date()
                                    });
                                }}
                            />
                        )}

                        {activeTab === 'pages' && (
                            <PageSettingsEditor
                                pages={site.pages.filter(page =>
                                    page.title.toLowerCase().includes(searchTerm.toLowerCase())
                                )}
                                currentPage={currentPage}
                                onPageSelect={setCurrentPage}
                                onUpdate={(newPages) => {
                                    handleSiteUpdate({ pages: newPages });
                                }}
                                onCreatePage={() => {
                                    const newPage: Page = {
                                        id: Date.now().toString(),
                                        title: 'New Page',
                                        slug: `page-${Date.now()}`,
                                        content: [],
                                        isPublished: false,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                        order: site.pages.length,
                                        children: [], // Add this for the new nesting feature
                                        parentId: null, // Add this for the new nesting feature
                                        isDummy: false, // Add this for the new dummy page feature
                                        showInNav: true // Add this for nav visibility
                                    };
                                    handleSiteUpdate({
                                        pages: [...site.pages, newPage]
                                    });
                                    setCurrentPage(newPage);
                                }}
                                onDeletePage={(pageId) => {
                                    const confirmed = window.confirm('Are you sure you want to delete this page?');
                                    if (confirmed) {
                                        handleSiteUpdate({
                                            pages: site.pages.filter(p => p.id !== pageId)
                                        });
                                        if (currentPage?.id === pageId) {
                                            setCurrentPage(site.pages[0]);
                                        }
                                    }
                                }}
                            />
                        )}

                        {activeTab === 'themes' && (
                            <ThemeEditor
                                currentTheme={site.theme}
                                onThemeChange={handleThemeChange}
                            />
                        )}
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
    )};
export { GoogleSitesClone };