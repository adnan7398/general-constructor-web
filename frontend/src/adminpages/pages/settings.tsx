import React, { useState, useEffect } from 'react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Users, 
  FileText, 
  Globe,
  Save,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';

interface SettingsData {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    projectUpdates: boolean;
    taskAssignments: boolean;
    weeklyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    sidebarCollapsed: boolean;
    compactMode: boolean;
    colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  };
  system: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    dataRetention: number;
    debugMode: boolean;
  };
  integrations: {
    slackIntegration: boolean;
    emailIntegration: boolean;
    calendarSync: boolean;
    fileStorage: 'local' | 'cloud';
  };
}

export default function SettingsPage() {
  const { settings: appearanceSettings, updateSettings: updateAppearance } = useAppearance();
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      projectUpdates: true,
      taskAssignments: true,
      weeklyReports: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false,
      colorScheme: 'blue',
    },
    system: {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: 365,
      debugMode: false,
    },
    integrations: {
      slackIntegration: false,
      emailIntegration: true,
      calendarSync: false,
      fileStorage: 'local',
    },
  });

  const [loading, setLoading] = useState(false); // Start with false to show default settings
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:3000/settings';

  console.log('Settings component - Token:', token ? 'exists' : 'missing');
  console.log('Settings component - Current settings:', settings);

  // Fetch settings on component mount
  useEffect(() => {
    if (token) {
      fetchSettings();
    } else {
      console.log('No token found, using default settings');
      setLoading(false);
    }
  }, [token]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      console.log('Fetched settings:', data);
      
      // Ensure all settings categories exist with default values
      const defaultSettings = {
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          projectUpdates: true,
          taskAssignments: true,
          weeklyReports: false,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          loginAttempts: 5,
        },
        appearance: {
          theme: 'light',
          sidebarCollapsed: false,
          compactMode: false,
          colorScheme: 'blue',
        },
        system: {
          autoBackup: true,
          backupFrequency: 'weekly',
          dataRetention: 365,
          debugMode: false,
        },
        integrations: {
          slackIntegration: false,
          emailIntegration: true,
          calendarSync: false,
          fileStorage: 'local',
        },
      };

      // Merge fetched data with defaults to ensure all properties exist
      const mergedSettings = {
        notifications: { ...defaultSettings.notifications, ...data.notifications },
        security: { ...defaultSettings.security, ...data.security },
        appearance: { ...defaultSettings.appearance, ...data.appearance },
        system: { ...defaultSettings.system, ...data.system },
        integrations: { ...defaultSettings.integrations, ...data.integrations },
      };

      setSettings(mergedSettings);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSettingChange = (category: keyof SettingsData, setting: string, value: any) => {
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      };
    });

    // Apply appearance changes immediately
    if (category === 'appearance') {
      updateAppearance({ [setting]: value });
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const data = await response.json();
      console.log('Settings saved:', data);
      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/profile/me/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert(error.message || 'Failed to change password');
    }
  };

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      alert('Settings reset to default successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to reset settings');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', name: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'system', name: 'System', icon: <Database className="w-4 h-4" /> },
    { id: 'integrations', name: 'Integrations', icon: <Globe className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Safety check to ensure settings exist
  if (!settings || !settings.notifications || !settings.security || !settings.appearance || !settings.system || !settings.integrations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Settings data is incomplete. Please refresh the page.</p>
          <button 
            onClick={fetchSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-slate-600 mt-1">Configure your dashboard preferences and system settings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportSettings}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                <AlertTriangle className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Email Notifications</h3>
                        <p className="text-slate-600 text-sm">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Push Notifications</h3>
                        <p className="text-slate-600 text-sm">Receive browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Project Updates</h3>
                        <p className="text-slate-600 text-sm">Get notified about project changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.projectUpdates}
                          onChange={(e) => handleSettingChange('notifications', 'projectUpdates', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Task Assignments</h3>
                        <p className="text-slate-600 text-sm">Notify when tasks are assigned to you</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.taskAssignments}
                          onChange={(e) => handleSettingChange('notifications', 'taskAssignments', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Weekly Reports</h3>
                        <p className="text-slate-600 text-sm">Receive weekly summary reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.weeklyReports}
                          onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Two Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Two-Factor Authentication</h3>
                        <p className="text-slate-600 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Session Timeout */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Session Timeout (minutes)</h3>
                      <p className="text-slate-600 text-sm mb-3">Automatically log out after inactivity</p>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={480}>8 hours</option>
                      </select>
                    </div>

                    {/* Password Expiry */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Password Expiry (days)</h3>
                      <p className="text-slate-600 text-sm mb-3">Force password change after specified days</p>
                      <select
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>6 months</option>
                        <option value={365}>1 year</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>

                    {/* Login Attempts */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Maximum Login Attempts</h3>
                      <p className="text-slate-600 text-sm mb-3">Lock account after failed attempts</p>
                      <select
                        value={settings.security.loginAttempts}
                        onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value={3}>3 attempts</option>
                        <option value={5}>5 attempts</option>
                        <option value={10}>10 attempts</option>
                        <option value={0}>No limit</option>
                      </select>
                    </div>

                    {/* Change Password */}
                    <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                        >
                          <Shield className="w-4 h-4" />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Appearance Settings</h2>
                  
                  {/* Live Preview */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-slate-800 mb-2">Live Preview</h3>
                    <p className="text-slate-600 text-sm mb-3">See your changes in real-time</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Current Theme:</span> 
                        <span className="ml-2 capitalize text-blue-600">{appearanceSettings.theme}</span>
                      </div>
                      <div>
                        <span className="font-medium">Color Scheme:</span> 
                        <span className="ml-2 capitalize text-blue-600">{appearanceSettings.colorScheme}</span>
                      </div>
                      <div>
                        <span className="font-medium">Sidebar:</span> 
                        <span className="ml-2 text-blue-600">{appearanceSettings.sidebarCollapsed ? 'Collapsed' : 'Expanded'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Mode:</span> 
                        <span className="ml-2 text-blue-600">{appearanceSettings.compactMode ? 'Compact' : 'Normal'}</span>
                      </div>
                    </div>
                    
                    {/* Quick Theme Toggle */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Quick Theme Toggle:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              appearanceSettings.theme === 'light'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              appearanceSettings.theme === 'dark'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Dark
                          </button>
                          <button
                            onClick={() => handleSettingChange('appearance', 'theme', 'auto')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              appearanceSettings.theme === 'auto'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Theme */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Theme</h3>
                      <p className="text-slate-600 text-sm mb-3">Choose your preferred color scheme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'auto'] as const).map((theme) => (
                          <button
                            key={theme}
                            onClick={() => handleSettingChange('appearance', 'theme', theme)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              appearanceSettings.theme === theme
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="text-sm font-medium capitalize">{theme}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Color Scheme</h3>
                      <p className="text-slate-600 text-sm mb-3">Select your preferred accent color</p>
                      <div className="grid grid-cols-4 gap-3">
                        {(['blue', 'green', 'purple', 'orange'] as const).map((color) => (
                          <button
                            key={color}
                            onClick={() => handleSettingChange('appearance', 'colorScheme', color)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              appearanceSettings.colorScheme === color
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full mx-auto mb-2 bg-${color}-500`}></div>
                            <div className="text-sm font-medium capitalize">{color}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Layout Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-slate-800">Collapsed Sidebar</h3>
                          <p className="text-slate-600 text-sm">Minimize sidebar by default</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearanceSettings.sidebarCollapsed}
                            onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-slate-800">Compact Mode</h3>
                          <p className="text-slate-600 text-sm">Reduce spacing for more content</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearanceSettings.compactMode}
                            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Auto Backup */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Automatic Backup</h3>
                        <p className="text-slate-600 text-sm">Automatically backup your data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.autoBackup}
                          onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Backup Frequency */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Backup Frequency</h3>
                      <p className="text-slate-600 text-sm mb-3">How often to create backups</p>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {/* Data Retention */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">Data Retention (days)</h3>
                      <p className="text-slate-600 text-sm mb-3">How long to keep backup data</p>
                      <select
                        value={settings.system.dataRetention}
                        onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>6 months</option>
                        <option value={365}>1 year</option>
                        <option value={730}>2 years</option>
                      </select>
                    </div>

                    {/* Debug Mode */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Debug Mode</h3>
                        <p className="text-slate-600 text-sm">Enable detailed logging for troubleshooting</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.debugMode}
                          onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Integrations</h2>
                  
                  <div className="space-y-6">
                    {/* Slack Integration */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Slack Integration</h3>
                        <p className="text-slate-600 text-sm">Connect with Slack for notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.integrations.slackIntegration}
                          onChange={(e) => handleSettingChange('integrations', 'slackIntegration', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Email Integration */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Email Integration</h3>
                        <p className="text-slate-600 text-sm">Connect with your email provider</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.integrations.emailIntegration}
                          onChange={(e) => handleSettingChange('integrations', 'emailIntegration', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Calendar Sync */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">Calendar Sync</h3>
                        <p className="text-slate-600 text-sm">Sync with Google Calendar</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.integrations.calendarSync}
                          onChange={(e) => handleSettingChange('integrations', 'calendarSync', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* File Storage */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-800 mb-2">File Storage</h3>
                      <p className="text-slate-600 text-sm mb-3">Choose where to store uploaded files</p>
                      <select
                        value={settings.integrations.fileStorage}
                        onChange={(e) => handleSettingChange('integrations', 'fileStorage', e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="local">Local Storage</option>
                        <option value="cloud">Cloud Storage (AWS S3)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 