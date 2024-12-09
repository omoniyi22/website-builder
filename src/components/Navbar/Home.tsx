import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';
import { Menu, Search, Globe, Lock, Trash2, Plus } from 'lucide-react';

import { ThemeEditor } from './../ThemeEditor';
import { PageSettingsEditor } from './../PageSettings';
import { BlockLibrary } from './../BlockLibrary';

import { useToast } from '../../hooks/useToast';
import { useSiteData } from '../../hooks/useSiteData';
import { useAuth } from '../../hooks/useAuth';


import { createBlocksFromCombination } from './../BlockEditor/blockCombination';
import { createBlockFromTemplate } from './../BlockEditor/blockTemplates';
import type { Site, Page, Theme, PageSettings } from '.././../types';


import { pageSettingsToPage, pageToPageSettings } from '../../types';

function Navbar() {
  const pageSettingsToPages = (settings: PageSettings[], existingPages: Page[]): Page[] => {
    return settings.map(setting => {
      const existingPage = existingPages.find(p => p.id === setting.id);
      if (existingPage) {
      
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


  const handlePageSelect = (page: Page) => {
    setCurrentPage(page);
    console.log(`Navigated to: ${page.title}`);
  };


  const [site, setSite] = useState<Site | null>(
    {
      id: '1',
      name: 'Untitled Site',
      pages: [], // Initialize with empty array
      theme: {
        id: '1',
        name: 'Default',
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#10B981',
          background: {
            primary: '#FFFFFF',
            secondary: '#F3F4F6',
            accent: '#F0FDF4'
          },
          text: {
            primary: '#1F2937',
            secondary: '#4B5563',
            accent: '#059669',
            inverse: '#FFFFFF'
          }
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      }
    }
  );

  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<'insert' | 'pages' | 'themes'>('insert');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // const [check, setNav] = useState(false)

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

  // Handle site updates
  const handleSiteUpdate = useCallback((updates: Partial<Site>) => {
    if (!site) return;

    const newSite = { ...site, ...updates };
    setSite(newSite);
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

  

  // // Theme handling
  const handleThemeChange = (theme: Theme) => {
    handleSiteUpdate({ theme });
  };


  return (
    <div
      className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-50">
      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      // onClick={() => setNav(true)}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      <input
        type="text"
        // value={site.name}
        onChange={(e) => handleSiteUpdate({ name: e.target.value })}
        className="ml-4 px-2 py-1 text-lg font-normal hover:bg-gray-100 rounded outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Untitled site"
      />

      <div className="ml-auto flex items-center space-x-2">
        <button
          // onClick={() => handleUndo()}
          disabled={undoStack.length === 0}
          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="Undo"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
          </svg>
        </button>

        <button
          // onClick={() => handleRedo()}
          disabled={redoStack.length === 0}
          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="Redo"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
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
              <Globe className="w-4 h-4 mr-1" />
              Publish
            </>
          )}
        </button>
      </div>
    </div>

  )
}

export default Navbar