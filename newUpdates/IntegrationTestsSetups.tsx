// integration.test.ts
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { EditorIntegration } from './EditorIntegration';
import { useEditorStore } from './stateManagement';
import { useTheme } from './themeSystem';
import { mockSite, mockPage, mockTheme } from './testUtils';

describe('Editor Integration', () => {
  beforeEach(() => {
    // Reset all systems
    useEditorStore.setState({
      site: null,
      currentPage: null,
      selectedBlockId: null,
      isDragging: false
    });

    // Clear localStorage
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize all systems correctly', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      await waitFor(() => {
        expect(getByText('Synced')).toBeInTheDocument();
      });
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock initialization failure
      jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('corrupt_data', 'invalid_json');

      const { getByText } = render(<EditorIntegration />);
      
      await waitFor(() => {
        expect(getByText('Initialization failed')).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('should sync state changes automatically', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      act(() => {
        useEditorStore.setState({ site: mockSite });
      });

      await waitFor(() => {
        expect(localStorage.getItem('site_current')).toBeTruthy();
      });
    });

    it('should handle concurrent edits correctly', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      await act(async () => {
        // Simulate concurrent edits
        useEditorStore.setState({ site: { ...mockSite, name: 'Site 1' } });
        useEditorStore.setState({ site: { ...mockSite, name: 'Site 2' } });
      });

      await waitFor(() => {
        const savedSite = JSON.parse(localStorage.getItem('site_current') || '{}');
        expect(savedSite.name).toBe('Site 2');
      });
    });
  });

  describe('Theme System', () => {
    it('should apply theme changes immediately', async () => {
      const { container } = render(<EditorIntegration />);
      
      act(() => {
        useTheme().setTheme(mockTheme);
      });

      await waitFor(() => {
        const styles = window.getComputedStyle(container.firstChild as Element);
        expect(styles.getPropertyValue('--theme-primary')).toBe(mockTheme.colors.primary);
      });
    });
  });

  describe('Page Management', () => {
    it('should handle page creation and deletion', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      act(() => {
        useEditorStore.getState().createPage(mockPage);
      });

      await waitFor(() => {
        expect(getByText(mockPage.title)).toBeInTheDocument();
      });

      act(() => {
        useEditorStore.getState().deletePage(mockPage.id);
      });

      await waitFor(() => {
        expect(() => getByText(mockPage.title)).toThrow();
      });
    });
  });

  describe('Preview and Publishing', () => {
    it('should generate preview correctly', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      act(() => {
        useEditorStore.setState({
          site: mockSite,
          currentPage: mockPage
        });
      });

      fireEvent.click(getByText('Preview'));

      await waitFor(() => {
        // Check that preview URL was generated
        expect(window.open).toHaveBeenCalled();
      });
    });

    it('should handle publishing process', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      act(() => {
        useEditorStore.setState({
          site: mockSite,
          currentPage: mockPage
        });
      });

      fireEvent.click(getByText('Publish'));

      await waitFor(() => {
        expect(getByText('Publication successful')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from data corruption', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      // Corrupt the data
      localStorage.setItem('site_current', 'invalid_json');

      act(() => {
        useEditorStore.setState({ site: mockSite });
      });

      await waitFor(() => {
        // Check that recovery was successful
        const savedSite = JSON.parse(localStorage.getItem('site_current') || '{}');
        expect(savedSite.id).toBe(mockSite.id);
      });
    });

    it('should handle network failures', async () => {
      const { getByText } = render(<EditorIntegration />);
      
      // Simulate network failure
      window.addEventListener('offline', () => {});
      window.dispatchEvent(new Event('offline'));

      await waitFor(() => {
        expect(getByText('Offline Mode')).toBeInTheDocument();
      });
    });
  });
});