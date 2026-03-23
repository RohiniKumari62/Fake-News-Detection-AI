import { useState } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Trash2, Eye, EyeOff, Save, Moon, Sun } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../components/common/Toast'
import Card, { CardHeader, CardBody } from '../components/common/Card'
import Button from '../components/common/Button'

const Section = ({ title, desc, children }) => (
  <Card>
    <CardHeader>
      <h3 className="text-sm font-semibold text-text-base">{title}</h3>
      {desc && <p className="text-xs text-text-muted mt-0.5">{desc}</p>}
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
)

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</label>
    {children}
  </div>
)

export default function Settings() {
  const { user, login } = useAuthStore()
  const { isDark, toggleTheme } = useTheme()
  const { success, error } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)

  const [notifs, setNotifs] = useState({
    analysisComplete: true,
    weeklyDigest: false,
    trendingAlerts: true,
    systemUpdates: true,
  })

  const handleSaveProfile = async () => {
    if (!name.trim()) { error('Validation error', 'Name cannot be empty.'); return }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    login({ ...user, name, email }, user?.token)
    setSaving(false)
    success('Profile updated', 'Your changes have been saved.')
  }

  const handleChangePassword = async () => {
    if (!currentPass || !newPass) { error('Validation error', 'Please fill in both password fields.'); return }
    if (newPass.length < 6) { error('Validation error', 'New password must be at least 6 characters.'); return }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setCurrentPass(''); setNewPass('')
    setSaving(false)
    success('Password changed', 'Your password has been updated successfully.')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This will permanently delete your account and all history. This cannot be undone.')) {
      error('Not implemented', 'Account deletion requires backend integration.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <SettingsIcon size={18} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-text-base text-lg">Settings</h2>
          <p className="text-xs text-text-muted">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile */}
      <Section title="Profile" desc="Update your personal information">
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-2xl font-display font-bold">
              {name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-text-base">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.provider === 'google' ? 'Google account' : user?.provider === 'apple' ? 'Apple account' : 'Email account'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-base" />
            </Field>
            <Field label="Email address">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-base" type="email" />
            </Field>
          </div>
          <Button variant="primary" size="md" icon={Save} loading={saving} onClick={handleSaveProfile}>
            Save changes
          </Button>
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" desc="Manage your password and authentication">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current password">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10"
                />
                <button onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            <Field label="New password">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </Field>
          </div>
          <Button variant="secondary" size="md" icon={Shield} loading={saving} onClick={handleChangePassword}>
            Update password
          </Button>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" desc="Customise how TruthLens looks">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-warning" />}
            <div>
              <p className="text-sm font-medium text-text-base">{isDark ? 'Dark mode' : 'Light mode'}</p>
              <p className="text-xs text-text-muted">Toggle between dark and light themes</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-border'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isDark ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" desc="Choose what you want to be notified about">
        <div className="space-y-4">
          {Object.entries({
            analysisComplete: 'Analysis complete alerts',
            weeklyDigest: 'Weekly misinformation digest',
            trendingAlerts: 'Trending fake news alerts',
            systemUpdates: 'System updates and announcements',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={14} className="text-text-muted" />
                <span className="text-sm text-text-base">{label}</span>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${notifs[key] ? 'bg-primary' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${notifs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone" desc="Irreversible account actions">
        <div className="flex items-center justify-between p-4 bg-danger/5 border border-danger/20 rounded-xl">
          <div>
            <p className="text-sm font-medium text-danger">Delete account</p>
            <p className="text-xs text-text-muted mt-0.5">Permanently delete your account and all data</p>
          </div>
          <Button variant="danger" size="sm" icon={Trash2} onClick={handleDeleteAccount}>
            Delete
          </Button>
        </div>
      </Section>
    </div>
  )
}