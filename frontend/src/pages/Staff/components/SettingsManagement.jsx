import React, { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Lock,
  Key,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Copy,
  Share
} from 'lucide-react'

const SettingsManagement = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [expandedSections, setExpandedSections] = useState(new Set(['general']))
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'SerendibGo',
      siteDescription: 'Your gateway to Sri Lankan adventures',
      siteUrl: 'https://serendibgo.com',
      adminEmail: 'admin@serendibgo.com',
      supportEmail: 'support@serendibgo.com',
      phoneNumber: '+94 11 234 5678',
      address: '123 Galle Road, Colombo 03, Sri Lanka',
      timezone: 'Asia/Colombo',
      currency: 'LKR',
      language: 'en',
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingAlerts: true,
      paymentAlerts: true,
      reviewAlerts: true,
      supportAlerts: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      loginAttempts: 5,
      ipWhitelist: [],
      apiRateLimit: 1000,
      sslEnabled: true,
      backupFrequency: 'daily'
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      bankTransferEnabled: true,
      stripePublishableKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalClientId: '...',
      paypalClientSecret: '...',
      defaultCurrency: 'LKR',
      taxRate: 15
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@serendibgo.com',
      smtpPassword: '********',
      smtpEncryption: 'tls',
      fromName: 'SerendibGo',
      fromEmail: 'noreply@serendibgo.com'
    },
    api: {
      apiVersion: 'v1',
      apiDocumentation: true,
      apiRateLimit: 1000,
      apiKeyExpiry: 365,
      webhookUrl: 'https://serendibgo.com/webhooks',
      webhookSecret: '********'
    }
  })

  const sections = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'api', label: 'API', icon: Server }
  ]

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleSave = async (section) => {
    setSaving(true)
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      showMessage('success', `${sections.find(s => s.id === section)?.label} saved successfully`)
    } catch (error) {
      showMessage('error', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Site URL</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
          <input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.general.phoneNumber}
            onChange={(e) => handleInputChange('general', 'phoneNumber', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Colombo">Asia/Colombo</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleInputChange('general', 'address', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LKR">LKR (Sri Lankan Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.general.maintenanceMode}
          onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-slate-700">
          Enable maintenance mode
        </label>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Notification Channels</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Email Notifications</h4>
              <p className="text-sm text-slate-600">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">SMS Notifications</h4>
              <p className="text-sm text-slate-600">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Push Notifications</h4>
              <p className="text-sm text-slate-600">Receive push notifications in browser</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Notification Types</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Booking Alerts</h4>
              <p className="text-sm text-slate-600">Get notified about new bookings</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.bookingAlerts}
              onChange={(e) => handleInputChange('notifications', 'bookingAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Payment Alerts</h4>
              <p className="text-sm text-slate-600">Get notified about payments</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.paymentAlerts}
              onChange={(e) => handleInputChange('notifications', 'paymentAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Review Alerts</h4>
              <p className="text-sm text-slate-600">Get notified about new reviews</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.reviewAlerts}
              onChange={(e) => handleInputChange('notifications', 'reviewAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Support Alerts</h4>
              <p className="text-sm text-slate-600">Get notified about support tickets</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.supportAlerts}
              onChange={(e) => handleInputChange('notifications', 'supportAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Authentication</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">API Security</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.security.apiRateLimit}
              onChange={(e) => handleInputChange('security', 'apiRateLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sslEnabled"
              checked={settings.security.sslEnabled}
              onChange={(e) => handleInputChange('security', 'sslEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sslEnabled" className="ml-2 block text-sm text-slate-700">
              Enable SSL/TLS encryption
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Backup</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Backup Frequency</label>
          <select
            value={settings.security.backupFrequency}
            onChange={(e) => handleInputChange('security', 'backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Payment Gateways</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Stripe</h4>
              <p className="text-sm text-slate-600">Credit card payments via Stripe</p>
            </div>
            <input
              type="checkbox"
              checked={settings.payment.stripeEnabled}
              onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">PayPal</h4>
              <p className="text-sm text-slate-600">PayPal payments</p>
            </div>
            <input
              type="checkbox"
              checked={settings.payment.paypalEnabled}
              onChange={(e) => handleInputChange('payment', 'paypalEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">Bank Transfer</h4>
              <p className="text-sm text-slate-600">Direct bank transfer</p>
            </div>
            <input
              type="checkbox"
              checked={settings.payment.bankTransferEnabled}
              onChange={(e) => handleInputChange('payment', 'bankTransferEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Stripe Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Publishable Key</label>
            <input
              type="text"
              value={settings.payment.stripePublishableKey}
              onChange={(e) => handleInputChange('payment', 'stripePublishableKey', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Secret Key</label>
            <input
              type="password"
              value={settings.payment.stripeSecretKey}
              onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">PayPal Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Client ID</label>
            <input
              type="text"
              value={settings.payment.paypalClientId}
              onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Client Secret</label>
            <input
              type="password"
              value={settings.payment.paypalClientSecret}
              onChange={(e) => handleInputChange('payment', 'paypalClientSecret', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Default Currency</label>
          <select
            value={settings.payment.defaultCurrency}
            onChange={(e) => handleInputChange('payment', 'defaultCurrency', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LKR">LKR (Sri Lankan Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
          <input
            type="number"
            value={settings.payment.taxRate}
            onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
            <input
              type="text"
              value={settings.email.smtpHost}
              onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Port</label>
            <input
              type="number"
              value={settings.email.smtpPort}
              onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              type="text"
              value={settings.email.smtpUsername}
              onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Encryption</label>
          <select
            value={settings.email.smtpEncryption}
            onChange={(e) => handleInputChange('email', 'smtpEncryption', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Email Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Name</label>
            <input
              type="text"
              value={settings.email.fromName}
              onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Email</label>
            <input
              type="email"
              value={settings.email.fromEmail}
              onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">API Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Version</label>
            <input
              type="text"
              value={settings.api.apiVersion}
              onChange={(e) => handleInputChange('api', 'apiVersion', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.api.apiRateLimit}
              onChange={(e) => handleInputChange('api', 'apiRateLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Key Expiry (days)</label>
            <input
              type="number"
              value={settings.api.apiKeyExpiry}
              onChange={(e) => handleInputChange('api', 'apiKeyExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
            <input
              type="url"
              value={settings.api.webhookUrl}
              onChange={(e) => handleInputChange('api', 'webhookUrl', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Webhook Secret</label>
          <input
            type="password"
            value={settings.api.webhookSecret}
            onChange={(e) => handleInputChange('api', 'webhookSecret', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="apiDocumentation"
            checked={settings.api.apiDocumentation}
            onChange={(e) => handleInputChange('api', 'apiDocumentation', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="apiDocumentation" className="ml-2 block text-sm text-slate-700">
            Enable API documentation
          </label>
        </div>
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'payment':
        return renderPaymentSettings()
      case 'email':
        return renderEmailSettings()
      case 'api':
        return renderApiSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
          <p className="text-slate-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-8">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-slate-600">
                  Configure {sections.find(s => s.id === activeSection)?.label.toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => handleSave(activeSection)}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsManagement
