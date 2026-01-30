import React, { useState, useEffect } from 'react';
import { useAppearance } from '../../contexts/AppearanceContext';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { getHeroContent, updateHeroContent, getTestimonials, createTestimonial, deleteTestimonial } from '../../api/website';
import { Camera, Trash2, Plus } from 'lucide-react';


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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/settings';

  useEffect(() => {
    if (token) {
      fetchSettings();
    } else {
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
      const response = await fetch('https://general-constructor-web-2.onrender.com/profile/me/change-password', {
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
    { id: 'website', name: 'Website Content', icon: <Globe className="w-4 h-4" /> },
  ];

  // Website Content State
  const [heroContent, setHeroContent] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', quote: '', rating: 5 });
  const [heroLoading, setHeroLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'website') {
      fetchWebsiteContent();
    }
  }, [activeTab]);

  const fetchWebsiteContent = async () => {
    try {
      const hero = await getHeroContent();
      const tests = await getTestimonials();
      setHeroContent(hero || { tagline: '', subtext: '' });
      setTestimonials(tests);
    } catch (error) {
      console.error('Failed to fetch website content', error);
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroLoading(true);
    try {
      const formData = new FormData();
      formData.append('tagline', heroContent.tagline);
      formData.append('subtext', heroContent.subtext);
      // Note: Image handling would require a file input state, simplified for now
      await updateHeroContent(formData);
      alert('Hero content updated!');
    } catch (error) {
      alert('Failed to update hero content');
    } finally {
      setHeroLoading(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newTestimonial.name);
      formData.append('role', newTestimonial.role);
      formData.append('quote', newTestimonial.quote);
      formData.append('rating', newTestimonial.rating.toString());
      await createTestimonial(formData);
      setNewTestimonial({ name: '', role: '', quote: '', rating: 5 });
      fetchWebsiteContent();
    } catch (error) {
      alert('Failed to add testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      fetchWebsiteContent();
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchSettings} variant="primary">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your workspace preferences</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportSettings} leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <label className="cursor-pointer">
            <div className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 h-8 px-3 text-xs">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </div>
            <input type="file" accept=".json" onChange={importSettings} className="hidden" />
          </label>
          <Button variant="danger" size="sm" onClick={handleResetSettings} leftIcon={<AlertTriangle className="w-4 h-4" />}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveSettings} loading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <Card className="p-2 h-fit lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <div className="space-y-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500">Manage how you receive notifications.</p>
                </div>
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500">Manage your account security and password.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                      <select
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>6 months</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button onClick={handlePasswordChange} variant="secondary">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">Customize the look and feel of your dashboard.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-900">Theme Preference</span>
                      <Badge variant="neutral">{appearanceSettings.theme}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {(['light', 'dark', 'auto'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSettingChange('appearance', 'theme', theme)}
                          className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${appearanceSettings.theme === theme
                            ? 'bg-white border-gray-900 text-gray-900 shadow-sm'
                            : 'bg-transparent border-transparent text-gray-600 hover:bg-white hover:shadow-sm'
                            }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Collapsed Sidebar</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appearance.sidebarCollapsed}
                          onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appearance.compactMode}
                          onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">System</h2>
                  <p className="text-sm text-gray-500">Configure system-level settings and backups.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Automatic Backups</h3>
                      <p className="text-xs text-gray-500">Enable automated data backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.system.autoBackup}
                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.system.backupFrequency}
                      onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                  <p className="text-sm text-gray-500">Connect with third-party tools.</p>
                </div>
                <div className="space-y-4">
                  {Object.entries(settings.integrations).map(([key, value]) => {
                    if (key === 'fileStorage') return null; // Handle separately
                    return (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => handleSettingChange('integrations', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                      </div>
                    )
                  })}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Storage Provider</label>
                    <select
                      value={settings.integrations.fileStorage}
                      onChange={(e) => handleSettingChange('integrations', 'fileStorage', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="local">Local Storage</option>
                      <option value="cloud">Cloud Storage (S3/GCS)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Website Content Tab */}
            {activeTab === 'website' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Website Content</h2>
                  <p className="text-sm text-gray-500">Manage your landing page content.</p>
                </div>

                {/* Hero Section */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Hero Section</h3>
                  {heroContent && (
                    <form onSubmit={handleHeroUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <Input
                          value={heroContent.tagline}
                          onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
                          placeholder="e.g. Building Dreams into Reality"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtext</label>
                        <textarea
                          value={heroContent.subtext}
                          onChange={(e) => setHeroContent({ ...heroContent, subtext: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                          rows={3}
                          placeholder="Hero description..."
                        />
                      </div>
                      <Button type="submit" loading={heroLoading}>Update Hero</Button>
                    </form>
                  )}
                </div>

                {/* Testimonials Section */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Testimonials</h3>

                  {/* Add New */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium mb-3">Add New Testimonial</h4>
                    <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Client Name"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      />
                      <Input
                        placeholder="Role / Company"
                        value={newTestimonial.role}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      />
                      <div className="md:col-span-2">
                        <textarea
                          placeholder="Quote"
                          value={newTestimonial.quote}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          rows={2}
                        />
                      </div>
                      <Button type="submit" size="sm" variant="secondary" leftIcon={<Plus className="w-4 h-4" />}>Add Testimonial</Button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div key={t._id} className="flex items-start justify-between p-3 border border-gray-100 rounded-lg bg-white">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.role}</p>
                          <p className="text-sm text-gray-600 mt-1 italic">"{t.quote}"</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(t._id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}