import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';
import logo from "./../../assets/imgs/logo.png"
import { Menu, Search, Globe, Lock, Trash2, Plus, ArrowLeft } from 'lucide-react';

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

function Navbar({ home }: { home?: boolean }) {
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



  // Theme handling
  const handleThemeChange = (theme: Theme) => {
    handleSiteUpdate({ theme });
  };


  return (
    <div
      className="fixed top-0 left-0 right-0 h-[4rem] bg-white border-b border-gray-200 flex items-center px-4 z-50">
      
      {home &&
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"

        >
          <svg focusable="false" viewBox="0 0 24 24" height={24}><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
          {/* <ArrowLeft strokeWidth={"1px"} size={"20px"} /> */}
        </button>
      }

      {home ?
        <>
          <img src={logo} alt="site_home" className='h-[39px] mx-3' />
          <div className='text-[21.6px]'>
            <a href='/editor'>  Sites</a>
          </div>
        </> :

        <a href="/">
          <img src={logo} alt="site_home" className='h-[37px]' />
        </a>
      }


      {
        home ?

          // <input
          //   type="text"
          //   // value={site.name}
          //   onChange={(e) => handleSiteUpdate({ name: e.target.value })}
          //   className="mx-auto px-4 py-[0.50rem] text-[25px] font-normal hover:bg-gray-100  bg-[#F0F4F9] rounded-full outline-none focus:ring-2 focus:ring-blue-500 text-black "
          //   placeholder="Untitled site" defaultValue={"Untitled Site"}
          // /> :

          <div className="mx-auto max-w-[47rem] w-[64%]">
            <div className=''>
              <div className="group relative w-100 ">
                <input type="text" id="example9" className="block min-w-[100%]  rounded-full border-gray-300 px-[3.4rem]  transition-all hover:bg-gray-50 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 py-[0.75rem] shadow-none text-[1.03rem] bg-[#F0F4F9] placeholder-[#300707f4] focus:shadow-lg focus:outline-none" placeholder="Search" />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500 ml-[0.3rem] cursor-pointer z-10">
                  <svg className='cursor-pointer' focusable="false" viewBox="0 0 24 24" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg"><path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path><path d="M0,0h24v24H0V0z" fill="none"></path></svg>
                </div>
              </div>
            </div>
          </div> :
          <input
            type="text"
            // value={site.name}
            onChange={(e) => handleSiteUpdate({ name: e.target.value })}
            className="ml-3 px-2 py-[0.20rem] text-[21px] font-normal hover:bg-gray-100 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black rounded-sm max-w-[11rem]"
            placeholder="Untitled site" defaultValue={"Untitled Site"}
          />

      }

      <div className='min-w-[9%] ml-auto'>
        {
          home ?
            <div className='w-9 h-9 rounded-full border ml-auto mr-5 bg-[#700d91a2] flex justify-center items-center p-0 text-[1.3rem]  text-white cursor-pointer'>
              <div className='mb-[rem] font-[productRegular]'>O</div>
            </div> :



            <div className="ml-auto flex items-center space-x-2 w-100 ">
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M hhikbc"><path d="M14.1 8H7.83l2.59-2.59L9 4 4 9l5 5 1.41-1.41L7.83 10h6.27c2.15 0 3.9 1.57 3.9 3.5S16.25 17 14.1 17H7v2h7.1c3.25 0 5.9-2.47 5.9-5.5S17.35 8 14.1 8z"></path></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M hhikbc"><path d="M6 13.5C6 11.57 7.75 10 9.9 10h6.27l-2.59 2.59L15 14l5-5-5-5-1.41 1.41L16.17 8H9.9C6.65 8 4 10.47 4 13.5S6.65 19 9.9 19H17v-2H9.9C7.75 17 6 15.43 6 13.5z"></path></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M"><path d="M5 6h16V4H5c-1.1 0-2 .9-2 2v11H1v3h11v-3H5V6zm16 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"></path></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2z"></path><path d="M8 11h8v2H8z"></path></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M hhikbc"><path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1zm3-4v-3h-3V9h3V6h2v3h3v2h-3v3h-2z"></path></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M"><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"></path><circle cx="12" cy="12" r="3.5"></circle></svg>
              </button>
              <button
                className="p-[0.65rem] hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className=" NMm5M"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
              </button>

              <button className="bg-[#3F51B5] text-white font-medium py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-[14.5px] ml-2 mr-4">
                Publish
              </button>

              <div className='mx-2'></div>

              <div className='w-9 h-9 rounded-full border ml-auto mx-10 bg-[#700d91a2] flex justify-center items-center p-0 text-[1.3rem]  text-white cursor-pointer'>
                <div className='mb-[rem] font-[productRegular]'>O</div>
              </div>

              <div className='mx-1'></div>


              {/* <button
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
              </button> */}
            </div>
        }
      </div>
    </div >
  )
}

export default Navbar