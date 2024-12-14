// editorIntegration.ts
import { createContext, useContext, useEffect, useRef } from 'react';
import { useEditorStore } from './stateManagement';
import { useTheme } from './themeSystem';
import { usePageSettings } from './pageSettingsSystem';
import { usePublishing } from './publishingSystem';
import { performanceOptimizer } from './performanceOptimizations';
import { ErrorHandler } from './errorHandling';
import { DataPersistenceManager } from './dataPersistence';
import type { Block, Page, Site, EditorConfig } from '../types';

interface EditorIntegrationContextType {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  addBlock: (blockType: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (blockId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  preview: () => Promise<string>;
  publish: () => Promise<void>;
  getSystemStatus: () => SystemStatus;
}

export class EditorIntegrationManager {
  private persistence: DataPersistenceManager;
  private errorHandler: ErrorHandler;
  private initialized = false;

  constructor(private config: EditorConfig) {
    this.persistence = new DataPersistenceManager();
    this.errorHandler = new ErrorHandler();
    performanceOptimizer.startMetricsCollection();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize all subsystems
      await this.initializeSubsystems();
      
      // Load saved data
      const savedData = await this.persistence.loadSite(this.config.siteId);
      if (savedData) {
        useEditorStore.setState({ site: savedData });
      }

      // Setup event listeners
      this.setupEventListeners();

      this.initialized = true;
    } catch (error) {
      await this.errorHandler.handleError(error, {
        component: 'EditorIntegration',
        action: 'initialize'
      });
    }
  }

  private async initializeSubsystems() {
    // Theme system
    const theme = useTheme();
    theme.initialize();

    // Page settings
    const pageSettings = usePageSettings();
    await pageSettings.initialize();

    // Performance monitoring
    performanceOptimizer.startPerformanceMonitoring();
  }

  private setupEventListeners() {
    // Handle store changes
    useEditorStore.subscribe((state) => {
      this.handleStateChange(state);
    });

    // Handle block selection
    document.addEventListener('selectionchange', () => {
      this.handleSelectionChange();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcut(e);
    });
  }

  private handleStateChange = performanceOptimizer.useOptimizedCallback((state: any) => {
    // Auto-save changes
    this.persistence.handleUpdate(state);

    // Update UI components
    this.updateUI(state);

    // Track changes for undo/redo
    this.trackStateChange(state);
  }, []);

  private handleSelectionChange() {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const block = this.findBlockFromRange(range);
    if (block) {
      useEditorStore.setState({ selectedBlockId: block.id });
    }
  }

  private handleKeyboardShortcut(e: KeyboardEvent) {
    // Handle common shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          this.undo();
          break;
        case 'y':
          e.preventDefault();
          this.redo();
          break;
        case 's':
          e.preventDefault();
          this.save();
          break;
      }
    }
  }

  // Block management
  async addBlock(blockType: string) {
    const state = useEditorStore.getState();
    const { currentPage } = state;
    if (!currentPage) return;

    try {
      const newBlock = await this.createBlock(blockType);
      const updatedContent = [...currentPage.content, newBlock];
      
      await this.updatePage(currentPage.id, {
        content: updatedContent
      });
    } catch (error) {
      await this.errorHandler.handleError(error, {
        component: 'EditorIntegration',
        action: 'addBlock',
        data: { blockType }
      });
    }
  }

  async updateBlock(blockId: string, updates: Partial<Block>) {
    const state = useEditorStore.getState();
    const { currentPage } = state;
    if (!currentPage) return;

    try {
      const updatedContent = this.updateBlockInContent(
        currentPage.content,
        blockId,
        updates
      );

      await this.updatePage(currentPage.id, {
        content: updatedContent
      });
    } catch (error) {
      await this.errorHandler.handleError(error, {
        component: 'EditorIntegration',
        action: 'updateBlock',
        data: { blockId, updates }
      });
    }
  }

  async moveBlock(blockId: string, targetId: string, position: 'before' | 'after' | 'inside') {
    const state = useEditorStore.getState();
    const { currentPage } = state;
    if (!currentPage) return;

    try {
      const updatedContent = this.reorderBlocks(
        currentPage.content,
        blockId,
        targetId,
        position
      );

      await this.updatePage(currentPage.id, {
        content: updatedContent
      });
    } catch (error) {
      await this.errorHandler.handleError(error, {
        component: 'EditorIntegration',
        action: 'moveBlock',
        data: { blockId, targetId, position }
      });
    }
  }

  // Page management
  private async updatePage(pageId: string, updates: Partial<Page>) {
    const state = useEditorStore.getState();
    const { site } = state;
    if (!site) return;

    try {
      const updatedPages = site.pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      );

      await this.updateSite({
        ...site,
        pages: updatedPages
      });
    } catch (error) {
      await this.errorHandler.handleError(error, {
        component: 'EditorIntegration',
        action: 'updatePage',
        data: { pageId, updates }
      });
    }
  }

  // Site management
  private async updateSite(site: Site) {
    await performanceOptimizer.useOptimizedCallback(async () => {
      try {
        // Update store
        useEditorStore.setState({ site });

        // Save to persistence
        await this.persistence.saveSite(site);

        // Update theme if needed
        if (site.theme) {
          useTheme().setTheme(site.theme);
        }
      } catch (error) {
        await this.errorHandler.handleError(error, {
          component: 'EditorIntegration',
          action: 'updateSite',
          data: { site }
        });
      }
    }, [site])();
  }

  // Helper methods
  private updateBlockInContent(content: Block[], blockId: string, updates: Partial<Block>): Block[] {
    return content.map(block => {
      if (block.id === blockId) {
        return { ...block, ...updates };
      }
      if (block.children) {
        return {
          ...block,
          children: this.updateBlockInContent(block.children, blockId, updates)
        };
      }
      return block;
    });
  }

  private reorderBlocks(
    blocks: Block[],
    sourceId: string,
    targetId: string,
    position: 'before' | 'after' | 'inside'
  ): Block[] {
    // Implementation of block reordering logic
    return blocks;
  }

  private findBlockFromRange(range: Range): Block | null {
    // Implementation of finding block from selection range
    return null;
  }

  getSystemStatus(): SystemStatus {
    return {
      initialized: this.initialized,
      lastSaved: this.persistence.getLastSaveTime(),
      errors: this.errorHandler.getErrors(),
      performance: performanceOptimizer.getMetrics()
    };
  }
}

// Export context and hook
const EditorIntegrationContext = createContext<EditorIntegrationContextType | null>(null);

export const EditorIntegrationProvider: React.FC<{
  children: React.ReactNode;
  config: EditorConfig;
}> = ({ children, config }) => {
  const integrationManager = useRef(new EditorIntegrationManager(config));

  useEffect(() => {
    integrationManager.current.initialize();
  }, []);

  return (
    <EditorIntegrationContext.Provider value={integrationManager.current}>
      {children}
    </EditorIntegrationContext.Provider>
  );
};

export const useEditorIntegration = () => {
  const context = useContext(EditorIntegrationContext);
  if (!context) {
    throw new Error('useEditorIntegration must be used within an EditorIntegrationProvider');
  }
  return context;
};