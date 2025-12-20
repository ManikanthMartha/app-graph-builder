import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, ChevronDown, Loader2, AlertCircle, LayoutGrid } from 'lucide-react';
import { fetchApps, createApp, type App } from '../../api/mockApi';
import { useStore } from '../../store';
import { useShallow } from 'zustand/shallow';

export const AppSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { selectedAppId, setSelectedAppId } = useStore(
    useShallow((state) => ({
      selectedAppId: state.selectedAppId,
      setSelectedAppId: state.setSelectedAppId,
    }))
  );

  // Fetch apps query
  const {
    data: apps = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create app mutation
  const createAppMutation = useMutation({
    mutationFn: (name: string) => createApp(name),
    onSuccess: (newApp) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setSelectedAppId(newApp.id);
      setIsCreating(false);
      setNewAppName('');
      setIsOpen(false);
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter apps by search query
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected app
  const selectedApp = apps.find((app) => app.id === selectedAppId);

  const handleAppSelect = (app: App) => {
    setSelectedAppId(app.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateApp = () => {
    if (newAppName.trim()) {
      createAppMutation.mutate(newAppName.trim());
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors min-w-[220px]"
      >
        <LayoutGrid className="w-4 h-4 text-neutral-400" />
        <span className="flex-1 text-left text-sm text-white truncate">
          {selectedApp ? selectedApp.name : 'Select an app'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
          {/* Search & Create Row */}
          <div className="flex items-center gap-2 p-3 border-b border-neutral-700">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-800 border border-neutral-600 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              title="Create new graph"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Create New App Input */}
          {isCreating && (
            <div className="p-3 border-b border-neutral-700 bg-neutral-800/50">
              <input
                type="text"
                placeholder="Enter app name..."
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateApp()}
                autoFocus
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateApp}
                  disabled={!newAppName.trim() || createAppMutation.isPending}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-600 disabled:cursor-not-allowed rounded-md text-sm text-white transition-colors"
                >
                  {createAppMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Create'
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewAppName('');
                  }}
                  className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* App List */}
          <div className="max-h-[280px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-400 mb-2">
                  {error instanceof Error ? error.message : 'Failed to load apps'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Try again
                </button>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-500">
                {searchQuery ? 'No apps match your search' : 'No apps yet. Create one!'}
              </div>
            ) : (
              filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppSelect(app)}
                  className={`w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors border-b border-neutral-800 last:border-b-0 ${
                    selectedAppId === app.id ? 'bg-indigo-600/20 border-l-2 border-l-indigo-500' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-white">{app.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5 truncate">
                    {app.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
