// pageSettingsSystem.ts
import { createContext, useContext, useState, useCallback } from 'react';
import type { Page, Site, NavigationItem } from '../types';

interface PageSettingsContextType {
  updatePageSettings: (pageId: string, settings: Partial<Page>) => void;
  updatePageHierarchy: (pageId: string, parentId: string | null) => void;
  updatePageOrder: (pageId: string, newOrder: number) => void;
  getPagePath: (pageId: string) => string;
  getPageBreadcrumbs: (pageId: string) => Page[];
  getChildPages: (pageId: string | null) => Page[];
  generateSiteMap: () => NavigationItem[];
  getNavigationMenu: () => NavigationItem[];
  reorderPages: (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

export const PageSettingsContext = createContext<PageSettingsContextType>({} as PageSettingsContextType);

export const usePageSettings = () => useContext(PageSettingsContext);

export const PageSettingsProvider: React.FC<{
  children: React.ReactNode;
  site: Site;
  onUpdate: (site: Site) => void;
}> = ({ children, site, onUpdate }) => {
  // Update page settings
  const updatePageSettings = useCallback((pageId: string, settings: Partial<Page>) => {
    const updatedPages = site.pages.map(page => 
      page.id === pageId ? { ...page, ...settings, updatedAt: new Date() } : page
    );
    onUpdate({ ...site, pages: updatedPages });
  }, [site, onUpdate]);

  // Update page hierarchy
  const updatePageHierarchy = useCallback((pageId: string, parentId: string | null) => {
    const updatedPages = site.pages.map(page => {
      if (page.id === pageId) {
        return { ...page, parentId, updatedAt: new Date() };
      }
      // Remove page from old parent's children
      if (page.children?.includes(pageId)) {
        return {
          ...page,
          children: page.children.filter(id => id !== pageId),
          updatedAt: new Date()
        };
      }
      // Add page to new parent's children
      if (page.id === parentId) {
        return {
          ...page,
          children: [...(page.children || []), pageId],
          updatedAt: new Date()
        };
      }
      return page;
    });
    onUpdate({ ...site, pages: updatedPages });
  }, [site, onUpdate]);

  // Get page breadcrumbs
  const getPageBreadcrumbs = useCallback((pageId: string): Page[] => {
    const breadcrumbs: Page[] = [];
    let currentPage = site.pages.find(p => p.id === pageId);
    
    while (currentPage) {
      breadcrumbs.unshift(currentPage);
      currentPage = currentPage.parentId 
        ? site.pages.find(p => p.id === currentPage?.parentId)
        : null;
    }
    
    return breadcrumbs;
  }, [site.pages]);

  // Get page path
  const getPagePath = useCallback((pageId: string): string => {
    const breadcrumbs = getPageBreadcrumbs(pageId);
    return breadcrumbs
      .map(page => page.slug)
      .join('/');
  }, [getPageBreadcrumbs]);

  // Get child pages
  const getChildPages = useCallback((parentId: string | null): Page[] => {
    return site.pages
      .filter(page => page.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  }, [site.pages]);

  // Generate site map
  const generateSiteMap = useCallback((): NavigationItem[] => {
    const buildNavTree = (parentId: string | null): NavigationItem[] => {
      return getChildPages(parentId)
        .filter(page => page.showInNav)
        .map(page => ({
          id: page.id,
          title: page.title,
          path: getPagePath(page.id),
          children: buildNavTree(page.id),
          isPublished: page.isPublished
        }));
    };

    return buildNavTree(null);
  }, [getChildPages, getPagePath]);

  // Get navigation menu
  const getNavigationMenu = useCallback((): NavigationItem[] => {
    return generateSiteMap().filter(item => item.isPublished);
  }, [generateSiteMap]);

  // Reorder pages
  const reorderPages = useCallback((sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    const sourcePage = site.pages.find(p => p.id === sourceId);
    const targetPage = site.pages.find(p => p.id === targetId);
    if (!sourcePage || !targetPage) return;

    let newParentId = targetPage.parentId;
    let siblingPages = site.pages.filter(p => p.parentId === targetPage.parentId);
    let newOrder = targetPage.order;

    if (position === 'inside') {
      newParentId = targetId;
      siblingPages = site.pages.filter(p => p.parentId === targetId);
      newOrder = siblingPages.length;
    } else if (position === 'after') {
      newOrder = targetPage.order + 1;
    }

    // Update orders for affected pages
    const updatedPages = site.pages.map(page => {
      if (page.id === sourceId) {
        return { ...page, parentId: newParentId, order: newOrder };
      }
      if (page.parentId === newParentId && page.order >= newOrder) {
        return { ...page, order: page.order + 1 };
      }
      return page;
    });

    onUpdate({ ...site, pages: updatedPages });
  }, [site, onUpdate]);

  const value = {
    updatePageSettings,
    updatePageHierarchy,
    updatePageOrder: (pageId: string, newOrder: number) => 
      updatePageSettings(pageId, { order: newOrder }),
    getPagePath,
    getPageBreadcrumbs,
    getChildPages,
    generateSiteMap,
    getNavigationMenu,
    reorderPages
  };

  return (
    <PageSettingsContext.Provider value={value}>
      {children}
    </PageSettingsContext.Provider>
  );
};