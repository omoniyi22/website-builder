// pageTemplates.ts
import type { Page, Block, Template, TemplateCategory } from '../types';

interface TemplateOptions {
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  blocks: Block[];
  settings?: Partial<Page>;
}

export class TemplateManager {
  private templates: Map<string, Template> = new Map();
  private customTemplates: Map<string, Template> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    // Landing Page
    this.registerTemplate({
      name: 'Landing Page',
      description: 'A conversion-focused landing page with hero, features, and CTA sections',
      category: 'marketing',
      blocks: [
        {
          type: 'hero',
          content: {
            heading: 'Welcome to our site',
            subheading: 'Discover amazing features',
            ctaText: 'Get Started',
            ctaUrl: '#'
          },
          settings: {
            padding: 'large',
            background: 'gradient'
          }
        },
        {
          type: 'features',
          content: {
            columns: 3,
            features: [
              {
                title: 'Feature 1',
                description: 'Amazing feature description',
                icon: 'star'
              },
              {
                title: 'Feature 2',
                description: 'Amazing feature description',
                icon: 'heart'
              },
              {
                title: 'Feature 3',
                description: 'Amazing feature description',
                icon: 'zap'
              }
            ]
          }
        },
        {
          type: 'cta',
          content: {
            heading: 'Ready to get started?',
            buttonText: 'Sign Up Now',
            buttonUrl: '#'
          }
        }
      ],
      settings: {
        layout: 'full-width',
        navigation: {
          style: 'transparent',
          position: 'fixed'
        }
      }
    });

    // Blog Post
    this.registerTemplate({
      name: 'Blog Post',
      description: 'A clean and readable blog post layout',
      category: 'content',
      blocks: [
        {
          type: 'header',
          content: {
            title: 'Blog Post Title',
            metadata: {
              author: true,
              date: true,
              readTime: true
            }
          }
        },
        {
          type: 'image',
          content: {
            aspectRatio: '16:9',
            caption: true
          }
        },
        {
          type: 'text',
          content: {
            placeholder: 'Write your blog post content here...'
          },
          settings: {
            typography: {
              fontSize: 'lg',
              lineHeight: 'relaxed'
            }
          }
        },
        {
          type: 'share',
          content: {
            platforms: ['twitter', 'facebook', 'linkedin']
          }
        }
      ],
      settings: {
        layout: 'contained',
        sidebar: {
          enabled: true,
          position: 'right'
        }
      }
    });

    // Product Page
    this.registerTemplate({
      name: 'Product Page',
      description: 'A detailed product page with gallery, specs, and pricing',
      category: 'ecommerce',
      blocks: [
        {
          type: 'product-gallery',
          content: {
            layout: 'grid',
            zoom: true
          }
        },
        {
          type: 'product-info',
          content: {
            sections: ['title', 'price', 'variants', 'description']
          }
        },
        {
          type: 'tabs',
          content: {
            tabs: [
              {
                title: 'Description',
                content: 'Product description goes here...'
              },
              {
                title: 'Specifications',
                content: 'Product specs go here...'
              },
              {
                title: 'Reviews',
                content: 'Product reviews go here...'
              }
            ]
          }
        }
      ],
      settings: {
        layout: 'two-column',
        sticky: ['product-info']
      }
    });
  }

  registerTemplate(options: TemplateOptions): void {
    const template: Template = {
      id: `template-${Date.now()}`,
      ...options,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(template.id, template);
  }

  getTemplate(templateId: string): Template | undefined {
    return this.templates.get(templateId) || this.customTemplates.get(templateId);
  }

  getAllTemplates(): Template[] {
    return [
      ...Array.from(this.templates.values()),
      ...Array.from(this.customTemplates.values())
    ];
  }

  getTemplatesByCategory(category: TemplateCategory): Template[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  createPageFromTemplate(templateId: string, overrides?: Partial<Page>): Page {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return {
      id: `page-${Date.now()}`,
      title: 'New Page',
      slug: 'new-page',
      content: template.blocks,
      settings: {
        ...template.settings,
        ...overrides?.settings
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  saveAsTemplate(page: Page, options: Omit<TemplateOptions, 'blocks'>): void {
    const template: Template = {
      id: `custom-template-${Date.now()}`,
      ...options,
      blocks: page.content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customTemplates.set(template.id, template);
  }
}

// Export singleton instance
export const templateManager = new TemplateManager();