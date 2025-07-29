import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateSettings: (newSettings: Partial<AppearanceSettings>) => void;
  applyTheme: () => void;
  applyColorScheme: () => void;
}

const defaultSettings: AppearanceSettings = {
  theme: 'light',
  sidebarCollapsed: false,
  compactMode: false,
  colorScheme: 'blue',
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

interface AppearanceProviderProps {
  children: ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing appearance settings:', error);
      }
    }
  }, []);

  // Apply theme to document
  const applyTheme = () => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply current theme
    if (settings.theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(settings.theme);
    }
  };

  // Apply color scheme to document
  const applyColorScheme = () => {
    const root = document.documentElement;
    
    // Remove existing color scheme classes
    root.classList.remove('color-blue', 'color-green', 'color-purple', 'color-orange');
    
    // Apply current color scheme
    root.classList.add(`color-${settings.colorScheme}`);
  };

  // Apply settings when they change
  useEffect(() => {
    applyTheme();
    applyColorScheme();
    
    // Save to localStorage
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
  }, [settings]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<AppearanceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value: AppearanceContextType = {
    settings,
    updateSettings,
    applyTheme,
    applyColorScheme,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}; 