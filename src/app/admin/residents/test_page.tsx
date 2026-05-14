import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ResidentsPage from './page';

// Mock Lucide icons
vi.mock('lucide-react', () => {
  return {
    Users: () => <div data-testid="icon-users" />,
    Search: () => <div data-testid="icon-search" />,
    Bed: () => <div data-testid="icon-bed" />,
    Calendar: () => <div data-testid="icon-calendar" />,
    Phone: () => <div data-testid="icon-phone" />,
    FileText: () => <div data-testid="icon-filetext" />,
    AlertTriangle: () => <div data-testid="icon-alert" />,
    ArrowLeft: () => <div data-testid="icon-arrowleft" />,
    UserPlus: () => <div data-testid="icon-userplus" />
  };
});

// Mock Next Link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>
  };
});

// Mock Firebase client app
vi.mock('@/lib/firebase/clientApp', () => ({
  db: {} // Mock db object
}));

// Mock Firestore functions
const mockOnSnapshot = vi.fn();
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    onSnapshot: (...args: any[]) => mockOnSnapshot(...args),
    query: vi.fn(),
    orderBy: vi.fn(),
    doc: vi.fn(),
    deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
    addDoc: (...args: any[]) => mockAddDoc(...args),
    updateDoc: (...args: any[]) => mockUpdateDoc(...args),
    serverTimestamp: vi.fn()
  };
});

describe('ResidentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Setup onSnapshot to not fire immediately to test loading state
    mockOnSnapshot.mockImplementation(() => vi.fn());
    
    render(<ResidentsPage />);
    expect(screen.queryByText('Active Residents')).toBeInTheDocument();
    // It should render a spinner, since we don't have text we can just verify it doesn't render "No residents found"
    expect(screen.queryByText('No residents found')).not.toBeInTheDocument();
  });

  it('renders no residents found when empty', () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: [] });
      return vi.fn();
    });

    render(<ResidentsPage />);
    expect(screen.getByText('No residents found')).toBeInTheDocument();
  });

  it('renders a list of residents', () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ firstName: 'John', lastName: 'Doe', bed: '101A', compliance: 'good' }) }
        ]
      });
      return vi.fn();
    });

    render(<ResidentsPage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Bed 101A/i)).toBeInTheDocument();
  });

  it('opens and closes the new admission modal', async () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: [] });
      return vi.fn();
    });

    render(<ResidentsPage />);
    
    // Open modal
    fireEvent.click(screen.getByText('New Admission'));
    expect(screen.getByText('New Admission', { selector: 'h2' })).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('New Admission', { selector: 'h2' })).not.toBeInTheDocument();
    });
  });

  it('handles editing a resident', async () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ firstName: 'John', lastName: 'Doe', email: 'john@test.com' }) }
        ]
      });
      return vi.fn();
    });

    render(<ResidentsPage />);
    
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByText('Edit Resident')).toBeInTheDocument();
    
    // Change first name
    const firstNameInput = screen.getAllByRole('textbox')[0]; // Assuming first input is first name
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    
    // Save
    fireEvent.click(screen.getByText('Save Resident'));
    
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('handles deleting a resident', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ firstName: 'John', lastName: 'Doe' }) }
        ]
      });
      return vi.fn();
    });

    render(<ResidentsPage />);
    
    // Since we mocked lucide-react, the delete button contains AlertTriangle
    // The Edit Profile button is text, delete is icon only.
    const deleteBtn = screen.getByTestId('icon-alert').closest('button');
    fireEvent.click(deleteBtn!);
    
    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
