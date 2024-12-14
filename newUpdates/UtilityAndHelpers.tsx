// utils/index.ts
import { Block, Page, Site } from '../types';

// URL and slug utilities
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const validateSlug = (slug: string, existingSlugs: string[]): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && !existingSlugs.includes(slug);
};

// Block manipulation utilities
export const findBlock = (blocks: Block[], id: string): Block | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlock(block.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateBlock = (blocks: Block[], id: string, updates: Partial<Block>): Block[] => {
  return blocks.map(block => {
    if (block.id === id) {
      return { ...block, ...updates };
    }
    if (block.children) {
      return {
        ...block,
        children: updateBlock(block.children, id, updates)
      };
    }
    return block;
  });
};

// Auto-save functionality
export const createAutoSave = (
  save: (data: any) => Promise<void>,
  debounceTime = 1000
) => {
  let timeout: NodeJS.Timeout;
  let lastSave = Date.now();

  return (data: any) => {
    clearTimeout(timeout);

    const now = Date.now();
    const timeSinceLastSave = now - lastSave;

    if (timeSinceLastSave >= debounceTime) {
      lastSave = now;
      return save(data);
    }

    return new Promise<void>(resolve => {
      timeout = setTimeout(() => {
        lastSave = Date.now();
        save(data).then(resolve);
      }, debounceTime - timeSinceLastSave);
    });
  };
};

// SEO utilities
export const generateMetaTags = (page: Page, site: Site) => {
  const title = page.seo?.title || page.title;
  const description = page.seo?.description || site.description;
  const image = page.seo?.image || site.image;

  return {
    title: `${title} | ${site.name}`,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ]
  };
};

// Analytics helpers
export const trackPageEdit = (pageId: string, changes: any) => {
  // Implementation would depend on analytics provider
  console.log('Page edited:', pageId, changes);
};

export const trackPublish = (pageId: string) => {
  console.log('Page published:', pageId);
};

// Error handling
export class EditorError extends Error {
  constructor(
    message: string,
    public code: string,
    public metadata?: any
  ) {
    super(message);
    this.name = 'EditorError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof EditorError) {
    // Handle known editor errors
    switch (error.code) {
      case 'INVALID_BLOCK':
        return { message: 'Invalid block configuration' };
      case 'SAVE_FAILED':
        return { message: 'Failed to save changes' };
      default:
        return { message: error.message };
    }
  }
  
  // Handle unknown errors
  console.error('Unexpected error:', error);
  return { message: 'An unexpected error occurred' };
};

// Image optimization
export const optimizeImage = async (file: File) => {
  // Basic image validation
  if (!file.type.startsWith('image/')) {
    throw new EditorError('Invalid file type', 'INVALID_FILE_TYPE');
  }

  // Check file size
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new EditorError('File too large', 'FILE_TOO_LARGE');
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

// Export utilities
export const exportSite = async (site: Site) => {
  const exportData = {
    site,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${site.name}-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import utilities
export const importSite = async (file: File): Promise<Site> => {
  const text = await file.text();
  const data = JSON.parse(text);

  // Validate import data
  if (!data.site || !data.version) {
    throw new EditorError('Invalid import file', 'INVALID_IMPORT');
  }

  // Version compatibility check
  if (data.version !== '1.0') {
    throw new EditorError('Unsupported version', 'VERSION_MISMATCH');
  }

  return data.site;
};