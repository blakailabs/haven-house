import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BedManagementPage from './page';

// Mock Lucide icons
vi.mock('lucide-react', () => {
  return {
    Bed: () => <div data-testid="icon-bed" />,
    Search: () => <div data-testid="icon-search" />,
    ArrowLeft: () => <div data-testid="icon-arrowleft" />,
    Plus: () => <div data-testid="icon-plus" />,
    CheckCircle2: () => <div data-testid="icon-check" />,
    Settings2: () => <div data-testid="icon-settings" />,
    MapPin: () => <div data-testid="icon-mappin" />,
    Lock: () => <div data-testid="icon-lock" />,
    AlertTriangle: () => <div data-testid="icon-alert" />,
    UserPlus: () => <div data-testid="icon-userplus" />,
    UserMinus: () => <div data-testid="icon-userminus" />,
    Trash2: () => <div data-testid="icon-trash" />,
    Edit: () => <div data-testid="icon-edit" />
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

describe('BedManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats correctly based on data', () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ roomName: '101A', status: 'occupied', isOccupied: true }) },
          { id: '2', data: () => ({ roomName: '101B', status: 'available', isOccupied: false }) },
          { id: '3', data: () => ({ roomName: '102A', status: 'maintenance', isOccupied: false }) }
        ]
      });
      return vi.fn();
    });

    render(<BedManagementPage />);
    
    // Total Beds (3), Occupied (1), Available (1), Maintenance (1)
    expect(screen.getAllByText('Total Beds')[0].previousSibling).toHaveTextContent('3');
    expect(screen.getAllByText('Occupied')[0].previousSibling).toHaveTextContent('1');
    expect(screen.getAllByText('Available')[0].previousSibling).toHaveTextContent('1');
    expect(screen.getAllByText('Maintenance')[0].previousSibling).toHaveTextContent('1');
  });

  it('opens and closes the Add Bed modal', async () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: [] });
      return vi.fn();
    });

    render(<BedManagementPage />);
    
    // Open modal
    fireEvent.click(screen.getByText('Add Bed'));
    expect(screen.getByText('Add New Bed')).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Add New Bed')).not.toBeInTheDocument();
    });
  });

  it('handles editing a bed', async () => {
    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ roomName: '101A', status: 'available', isOccupied: false }) }
        ]
      });
      return vi.fn();
    });

    render(<BedManagementPage />);
    
    const editBtn = screen.getByTestId('icon-edit').closest('button');
    fireEvent.click(editBtn!);
    
    expect(screen.getByText('Edit Bed')).toBeInTheDocument();
    
    // Save
    fireEvent.click(screen.getByText('Save Bed'));
    
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('handles discharging a resident', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ roomName: '101A', status: 'occupied', isOccupied: true, residentName: 'John Doe' }) }
        ]
      });
      return vi.fn();
    });

    render(<BedManagementPage />);
    
    fireEvent.click(screen.getByText('Discharge'));
    
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('handles deleting a bed', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: [
          { id: '1', data: () => ({ roomName: '101A', status: 'available', isOccupied: false }) }
        ]
      });
      return vi.fn();
    });

    render(<BedManagementPage />);
    
    const deleteBtn = screen.getByTestId('icon-trash').closest('button');
    fireEvent.click(deleteBtn!);
    
    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
