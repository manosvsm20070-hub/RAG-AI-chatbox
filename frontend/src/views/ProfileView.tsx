import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  Globe2,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  Upload,
  Lock,
  Check,
  Sparkles,
  RefreshCw,
  BadgeCheck,
  AlertCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_AVATAR, getEffectiveAvatar } from '../constants/avatar';

export const ProfileView: React.FC = () => {
  const { user, updateLanguage, updateAvatar, changePassword, isHR } = useAuth();

  const defaultAvatar = getEffectiveAvatar(user?.avatar);

  // Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState<string>(defaultAvatar);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Sync with user avatar changes
  useEffect(() => {
    if (user?.avatar) {
      setSelectedAvatar(getEffectiveAvatar(user.avatar));
    }
  }, [user?.avatar]);

  // Language state
  const [preferredLang, setPreferredLang] = useState(user?.preferredLanguage || 'auto');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress image using HTML5 Canvas to ensure crisp headshot and fit in localStorage
  const compressAndProcessImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 300; // 300x300 high resolution avatar
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          // Center-crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('Image size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    try {
      const compressedDataUrl = await compressAndProcessImage(file);
      setSelectedAvatar(compressedDataUrl);
      // Auto-save and persist immediately so it never gets lost on logout/relogin
      updateAvatar(compressedDataUrl);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setPhotoError('Could not process this image. Please try another image.');
    }
  };

  const handleResetPhoto = () => {
    setSelectedAvatar(defaultAvatar);
    updateAvatar(defaultAvatar);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAvatar(selectedAvatar);
    updateLanguage(preferredLang as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword.trim()) {
      setPasswordError('Please enter your current (old) password.');
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (oldPassword.trim() === newPassword.trim()) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }

    setIsSubmittingPassword(true);
    const result = changePassword(oldPassword, newPassword);
    setIsSubmittingPassword(false);

    if (!result.success) {
      setPasswordError(result.error || 'Failed to update password.');
      return;
    }

    setPasswordSuccess('Password changed successfully! Please use your new password next time you sign in.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            User Profile & Corporate Identity
          </h1>
          <p className="text-xs text-on-surface-variant">
            Customize your professional photo avatar and AI language preferences
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs text-on-surface-variant self-start sm:self-auto border border-surface-container-high">
          <Lock className="w-3.5 h-3.5 text-outline" />
          <span>Profile Identity Managed by HR</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Professional profile photo and language preferences updated successfully!
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Professional Photo Editor (Interactive) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-bold text-sm text-on-surface">
                  Professional Photo Avatar
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
                Editable
              </span>
            </div>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/25 shadow-md bg-surface-container flex items-center justify-center">
                  <img
                    src={selectedAvatar}
                    alt={user?.name || 'User Avatar'}
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload New Photo"
                  className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-container transition-all hover:scale-110"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <p className="font-heading font-bold text-sm text-on-surface">
                  {user?.name || 'Employee Name'}
                </p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  ID: {user?.id || 'USR-000'}
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold mt-1">
                  <BadgeCheck className="w-3 h-3" />
                  <span>Corporate Active</span>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-xl transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-xl transition-colors"
                >
                  Reset Photo
                </button>
              </div>

              {photoError && (
                <div className="text-[11px] text-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}
            </div>

            {/* Photo Guidelines */}
            <div className="pt-3 border-t border-surface-container text-left space-y-1.5">
              <span className="text-[11px] font-semibold text-on-surface">Photo Guidelines:</span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Upload a clear corporate portrait or headshot. Supported formats: JPG, PNG, WebP (maximum 5MB).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Corporate Identity Details (Read-Only HR Governed) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h2 className="font-heading font-bold text-sm text-on-surface">
                  Company Identity & Workspace Permissions
                </h2>
                <p className="text-[11px] text-on-surface-variant">
                  Centrally provisioned and verified by Human Resources
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-outline">
                <Lock className="w-3.5 h-3.5" />
                <span>Read-Only</span>
              </div>
            </div>

            {/* HR Policy Notice Banner */}
            <div className="bg-primary-fixed/20 border border-primary/20 rounded-2xl p-3.5 text-xs text-on-surface flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-primary">Organizational Identity Policy: </span>
                <span>
                  Employee names, User IDs, roles, and squad assignments are locked by HR to ensure organizational compliance. To request updates to your official credentials, contact Human Resources.
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name (Read-Only) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Full Name
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> HR Locked
                    </span>
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="w-full bg-surface-container-low/70 pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface font-semibold border border-surface-container cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* User ID (Read-Only) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Corporate User ID
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user?.id || ''}
                    className="w-full bg-surface-container-low/70 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-primary border border-surface-container cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Work Email (Read-Only) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Work Email
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> HR Locked
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-surface-container-low/70 pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface-variant border border-surface-container cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Role / Access Level (Read-Only) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Workspace Role
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> RBAC
                    </span>
                  </div>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled
                      value={
                        isHR
                          ? 'Human Resources (HR Full Privileges)'
                          : user?.role === 'lead'
                          ? 'Team Lead (Read/View Access)'
                          : 'Squad Member (Read/View Access)'
                      }
                      className="w-full bg-surface-container-low/70 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-surface-container cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Department / Squad
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Assigned
                    </span>
                  </div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled
                      value={user?.department || 'Engineering'}
                      className="w-full bg-surface-container-low/70 pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface-variant border border-surface-container cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      Designation / Title
                    </label>
                    <span className="text-[10px] text-outline flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Official
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user?.title || 'Specialist'}
                    className="w-full bg-surface-container-low/70 px-3.5 py-2.5 rounded-xl text-xs text-on-surface-variant border border-surface-container cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Multilingual AI Query Preference (User Configurable) */}
              <div className="pt-2 border-t border-surface-container">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  AI Query Language Preference
                </label>
                <div className="relative">
                  <Globe2 className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as any)}
                    className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  >
                    <option value="auto">Auto-Detect (Seamless English, Tamil & Tanglish)</option>
                    <option value="ta">Tamil Script (தமிழ் முன்னுரிமை)</option>
                    <option value="tanglish">Tanglish Preferred (Romanized Tamil)</option>
                    <option value="en">English Only</option>
                  </select>
                </div>
                <p className="text-[11px] text-outline mt-1">
                  Nexus AI will respond in whichever dialect you type in when Auto-Detect is enabled.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Changes to photo will immediately reflect across your workspace.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/25 hover:scale-[1.02]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Account Security & Password Change Section */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-on-surface">
                Account Security & Password
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Change your login password by verifying your current old password
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-full self-start sm:self-auto">
            Old Password Verification Required
          </span>
        </div>

        {passwordSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="bg-error-container/40 border border-error/30 text-error text-xs p-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
            <span className="font-medium">{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current / Old Password */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Current (Old) Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-surface-container-low pl-10 pr-10 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? "Hide password" : "Show password"}
                  className="p-1 text-outline hover:text-on-surface absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                New Password *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-surface-container-low pl-10 pr-10 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="p-1 text-outline hover:text-on-surface absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <Check className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-surface-container-low pl-10 pr-10 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="p-1 text-outline hover:text-on-surface absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-outline">
              For security, you must provide your correct old password to confirm changes.
            </span>
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/25 hover:scale-[1.01] self-start sm:self-auto"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
