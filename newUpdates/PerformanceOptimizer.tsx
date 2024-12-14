// performanceOptimizations.ts
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { debounce, throttle } from 'lodash';

export class PerformanceOptimizer {
    private renderTimes: number[] = [];
    private mutationObserver: MutationObserver | null = null;
    private intersectionObserver: IntersectionObserver | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor() {
        this.initializeObservers();
    }

    private initializeObservers() {
        // Watch for DOM changes
        this.mutationObserver = new MutationObserver(
            throttle(this.handleDOMMutation.bind(this), 100)
        );

        // Watch for visibility changes
        this.intersectionObserver = new IntersectionObserver(
            this.handleVisibilityChange.bind(this),
            { threshold: 0.1 }
        );

        // Watch for size changes
        this.resizeObserver = new ResizeObserver(
            debounce(this.handleSizeChange.bind(this), 100)
        );
    }

    // React hooks for optimized rendering
    useOptimizedMemo<T>(factory: () => T, deps: any[]): T {
        return useMemo(() => {
            const start = performance.now();
            const result = factory();
            const end = performance.now();

            this.renderTimes.push(end - start);
            return result;
        }, deps);
    }

    useOptimizedCallback<T extends Function>(callback: T, deps: any[]): T {
        return useCallback((...args: any[]) => {
            const start = performance.now();
            const result = callback(...args);
            const end = performance.now();

            this.renderTimes.push(end - start);
            return result;
        }, deps) as T;
    }

    // Virtualization for large lists
    useVirtualization<T>(
        items: T[],
        itemHeight: number,
        containerHeight: number
    ) {
        const [visibleItems, setVisibleItems] = useState<T[]>([]);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!containerRef.current) return;

            const updateVisibleItems = () => {
                const scrollTop = containerRef.current?.scrollTop || 0;
                const startIndex = Math.floor(scrollTop / itemHeight);
                const endIndex = Math.min(
                    startIndex + Math.ceil(containerHeight / itemHeight),
                    items.length
                );

                setVisibleItems(items.slice(startIndex, endIndex));
            };

            const container = containerRef.current;
            container.addEventListener('scroll', updateVisibleItems);
            return () => container.removeEventListener('scroll', updateVisibleItems);
        }, [items, itemHeight, containerHeight]);

        return { visibleItems, containerRef };
    }

    // Lazy loading for components
    useLazyComponent<T extends React.ComponentType<any>>(
        importFn: () => Promise<{ default: T }>,
        options = { timeout: 5000 }
    ) {
        const [Component, setComponent] = useState<T | null>(null);

        useEffect(() => {
            const loadComponent = async () => {
                try {
                    const module = await Promise.race([
                        importFn(),
                        new Promise((_, reject) =>
                            setTimeout(() => reject('Timeout'), options.timeout)
                        )
                    ]);
                    setComponent(module.default);
                } catch (error) {
                    console.error('Failed to load component:', error);
                }
            };

            loadComponent();
        }, []);

        return Component;
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        const marks: Record<string, number> = {};

        return {
            mark: (name: string) => {
                marks[name] = performance.now();
            },
            measure: (name: string, startMark: string, endMark: string) => {
                const duration = marks[endMark] - marks[startMark];
                console.log(`${name}: ${duration}ms`);
                return duration;
            }
        };
    }

    // Resource loading optimization
    optimizeResourceLoading() {
        return {
            prefetchImage: (src: string) => {
                const img = new Image();
                img.src = src;
            },
            prefetchComponent: (path: string) => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = path;
                document.head.appendChild(link);
            }
        };
    }

    private handleDOMMutation(mutations: MutationRecord[]) {
        // Monitor and optimize DOM changes
    }

    private handleVisibilityChange(entries: IntersectionObserverEntry[]) {
        // Handle element visibility changes
    }

    private handleSizeChange(entries: ResizeObserverEntry[]) {
    //
    private handleDOMMutation(mutations: MutationRecord[]) {
        // Monitor and optimize DOM changes
        mutations.forEach(mutation => {
            // Check for expensive DOM operations
            if (mutation.type === 'childList' && mutation.addedNodes.length > 10) {
                this.batchDOMUpdates(Array.from(mutation.addedNodes));
            }

            // Monitor attribute changes that might trigger reflows
            if (mutation.type === 'attributes') {
                this.optimizeAttributeChange(mutation.target as Element, mutation.attributeName!);
            }
        });
    }

    private handleVisibilityChange(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            const element = entry.target;

            // Pause expensive operations for hidden elements
            if (!entry.isIntersecting) {
                this.pauseAnimations(element);
                this.unloadResources(element);
            } else {
                this.resumeAnimations(element);
                this.loadResources(element);
            }
        });
    }

    private handleSizeChange(entries: ResizeObserverEntry[]) {
        entries.forEach(entry => {
            // Optimize layout calculations
            this.debounceLayout(entry.target as HTMLElement);

            // Adjust image quality based on size
            this.optimizeImageQuality(entry.target as HTMLElement, entry.contentRect);

            // Update virtual scroll calculations
            this.updateVirtualScroll(entry.target as HTMLElement, entry.contentRect);
        });
    }

    // Performance monitoring and reporting
    private metrics = {
        fps: [] as number[],
        memoryUsage: [] as number[],
        renderTimes: [] as number[],
        networkRequests: [] as { url: string, duration: number }[]
    };

    startMetricsCollection() {
        // Monitor FPS
        let lastTime = performance.now();
        const measureFPS = () => {
            const currentTime = performance.now();
            const fps = 1000 / (currentTime - lastTime);
            this.metrics.fps.push(fps);
            lastTime = currentTime;
            requestAnimationFrame(measureFPS);
        };
        requestAnimationFrame(measureFPS);

        // Monitor memory usage if available
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage.push((performance as any).memory.usedJSHeapSize);
            }, 1000);
        }

        // Monitor network requests
        this.interceptNetworkRequests();
    }

    private interceptNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - startTime;
                this.metrics.networkRequests.push({
                    url: args[0].toString(),
                    duration
                });
                return response;
            } catch (error) {
                const duration = performance.now() - startTime;
                this.metrics.networkRequests.push({
                    url: args[0].toString(),
                    duration
                });
                throw error;
            }
        };
    }

    // Optimization utilities
    private batchDOMUpdates(nodes: Node[]) {
        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment();
            nodes.forEach(node => fragment.appendChild(node.cloneNode(true)));
            nodes[0].parentNode?.replaceChild(fragment, nodes[0]);
        });
    }

    private optimizeAttributeChange(element: Element, attributeName: string) {
        const reflowAttributes = ['width', 'height', 'top', 'left', 'font-size'];
        if (reflowAttributes.includes(attributeName)) {
            requestAnimationFrame(() => {
                element.classList.add('optimize-reflow');
                // Force reflow in batch
                element.getBoundingClientRect();
                element.classList.remove('optimize-reflow');
            });
        }
    }

    private pauseAnimations(element: Element) {
        element.getAnimations().forEach(animation => animation.pause());
        element.querySelectorAll('video, audio').forEach(media => {
            (media as HTMLMediaElement).pause();
        });
    }

    private resumeAnimations(element: Element) {
        element.getAnimations().forEach(animation => animation.play());
    }

    private debounceLayout = debounce((element: HTMLElement) => {
        this.recalculateLayout(element);
    }, 100);

    private recalculateLayout(element: HTMLElement) {
        // Implement efficient layout recalculation
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        // Update CSS Grid or Flexbox properties efficiently
        if (element.style.display === 'grid') {
            this.optimizeGridLayout(element, width, height);
        } else if (element.style.display === 'flex') {
            this.optimizeFlexLayout(element, width, height);
        }
    }

    private optimizeGridLayout(element: HTMLElement, width: number, height: number) {
        requestAnimationFrame(() => {
            // Calculate and update grid dimensions efficiently
            const columns = Math.floor(width / 100); // Assuming minimum column width of 100px
            element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        });
    }

    private optimizeFlexLayout(element: HTMLElement, width: number, height: number) {
        requestAnimationFrame(() => {
            // Calculate and update flex item sizes efficiently
            const items = element.children;
            const itemWidth = width / items.length;
            Array.from(items).forEach(item => {
                (item as HTMLElement).style.flexBasis = `${itemWidth}px`;
            });
        });
    }

    private optimizeImageQuality(element: HTMLElement, rect: DOMRectReadOnly) {
        const images = element.getElementsByTagName('img');
        Array.from(images).forEach(img => {
            // Adjust image source based on size
            const newSrc = this.getOptimalImageSource(img.src, rect.width, rect.height);
            if (img.src !== newSrc) {
                img.src = newSrc;
            }
        });
    }

    private getOptimalImageSource(currentSrc: string, width: number, height: number): string {
        // Implement logic to return the optimal image source based on dimensions
        // This would typically integrate with your image CDN or resizing service
        return currentSrc;
    }

    private updateVirtualScroll(element: HTMLElement, rect: DOMRectReadOnly) {
        if (element.dataset.virtualScroll) {
            this.recalculateVirtualScroll(element, rect.height);
        }
    }

    private recalculateVirtualScroll(element: HTMLElement, viewportHeight: number) {
        // Implementation of virtual scroll calculations
        const itemHeight = parseInt(element.dataset.itemHeight || '0');
        const totalItems = parseInt(element.dataset.totalItems || '0');

        if (itemHeight && totalItems) {
            const visibleItems = Math.ceil(viewportHeight / itemHeight);
            const buffer = Math.ceil(visibleItems / 2);

            // Update virtual scroll state
            element.dataset.visibleItems = visibleItems.toString();
            element.dataset.buffer = buffer.toString();
        }
    }
}

export const performanceOptimizer = new PerformanceOptimizer();