import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  CreditCard, 
  Users, 
  Shield, 
  Server, 
  DollarSign, 
  Wand2, 
  User as UserIcon, 
  Lock, 
  MessageSquare, 
  Copy, 
  Info, 
  Upload, 
  Check, 
  AlertCircle,
  Plus,
  Trash2,
  Key,
  Gem
} from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

// Import newly modularized settings page files
import { GeneralSettings } from './settings/GeneralSettings';
import { ConnectorsSettings } from './settings/ConnectorsSettings';
import { AddonsSettings } from './settings/AddonsSettings';
import { SubscriptionSettings } from './settings/SubscriptionSettings';
import { CloudSettings } from './settings/CloudSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeSettingsTab, 
    setActiveSettingsTab, 
    user,
    setPackageCredits,
    addNotification,
    glowFeatureEnabled,
    setGlowFeatureEnabled,
    finishSoundEnabled,
    setFinishSoundEnabled
  } = useStudioStore();

  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // State variables for interactive forms
  // General Section Form
  const [orgName, setOrgName] = useState('Nwuba Joshua');
  const [orgSlug, setOrgSlug] = useState('nwuba-joshua-cgue80oc');
  const orgId = 'org_01KWER0H92SY8GSHDSAY84EXY0';

  // Teammates state
  const [teammates, setTeammates] = useState([
    { email: 'nwuba.joshua@gmail.com', role: 'Owner', status: 'Active', name: 'Nwuba Joshua' },
    { email: 'sarah.lucid@lucid.dev', role: 'Admin', status: 'Active', name: 'Sarah Jenkins' },
    { email: 'developer@lucid.dev', role: 'Member', status: 'Pending', name: 'Alex Rivera' }
  ]);
  const [newTeammateEmail, setNewTeammateEmail] = useState('');
  const [newTeammateRole, setNewTeammateRole] = useState('Member');

  // SSO state
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [entityId, setEntityId] = useState('https://saml.lucid.dev/sp/metadata');
  const [ssoUrl, setSsoUrl] = useState('https://idp.sso.lucid.dev/saml2');

  // Commerce state
  const [paystackPub, setPaystackPub] = useState('pk_sandbox_5139048a1b2d03eef');
  const [paystackSec, setPaystackSec] = useState('sk_sandbox_88f921ea0283c847');
  const [requirePay, setRequirePay] = useState(true);

  // Profile image & Org logo upload states and refs
  const profileImageInputRef = React.useRef<HTMLInputElement>(null);
  const orgLogoInputRef = React.useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [orgLogoImg, setOrgLogoImg] = useState<string | null>(null);

  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImg(event.target.result as string);
          triggerToast('Profile image uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrgLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOrgLogoImg(event.target.result as string);
          triggerToast('Organization logo uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile state
  const [profileName, setProfileName] = useState('Nwuba Joshua');
  const [profileEmail, setProfileEmail] = useState('nwuba.joshua@gmail.com');
  const [curPassword, setCurPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Security state
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied to clipboard!`);
  };

  const handleSaveGeneralOrg = () => {
    triggerToast('Organization profile updated successfully');
    addNotification('info', 'Organization Updated', `Organization name updated to ${orgName}.`);
  };

  const handleAddTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeammateEmail) return;
    
    // Simple mock name from email prefix
    const mockName = newTeammateEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    
    setTeammates([...teammates, {
      email: newTeammateEmail,
      role: newTeammateRole,
      status: 'Pending',
      name: mockName
    }]);
    
    triggerToast(`Invitation sent to ${newTeammateEmail}`);
    addNotification('info', 'Team Invitation Sent', `Invited ${newTeammateEmail} as ${newTeammateRole}.`);
    setNewTeammateEmail('');
  };

  const handleRemoveTeammate = (email: string) => {
    setTeammates(teammates.filter(t => t.email !== email));
    triggerToast(`Revoked invitation or removed ${email}`);
  };

  const handleSaveSso = () => {
    triggerToast('SSO Configuration Saved');
    addNotification('info', 'SSO Configured', `SSO status set to ${ssoEnabled ? 'Enabled' : 'Disabled'}.`);
  };

  const handleSaveCommerce = () => {
    triggerToast('Commerce and Paystack credentials updated');
    addNotification('billing', 'Paystack Keys Saved', 'Sandbox payment credentials successfully registered.');
  };

  const handleSaveProfile = () => {
    triggerToast('Personal profile saved');
    addNotification('info', 'Profile Changed', 'Name and email settings saved.');
  };

  const handleSaveSecurity = () => {
    triggerToast('Security configurations updated');
    setCurPassword('');
    setNewPassword('');
  };

  const navItems = [
    // Organization Group
    { id: 'general', label: 'General', icon: Home, section: 'Organization' },
    { id: 'subscription', label: 'Billing', icon: CreditCard, section: 'Organization' },
    { id: 'teammates', label: 'Teammates', icon: Users, section: 'Organization' },
    { id: 'sso', label: 'SSO', icon: Shield, section: 'Organization' },
    { id: 'cloud', label: 'Data residency', icon: Server, section: 'Organization' },

    // Personal Group
    { id: 'profile', label: 'Profile', icon: UserIcon, section: 'Personal' },
    { id: 'security', label: 'Security', icon: Lock, section: 'Personal' },
    { id: 'connectors', label: 'Chat Integrations', icon: MessageSquare, section: 'Personal' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Toast Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed top-8 right-8 z-[1000] max-w-sm bg-zinc-950/95 border border-white/20 text-white py-3 px-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.05)] flex items-center gap-2.5 backdrop-blur-xl"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span className="text-xs font-bold font-sans">{notification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Container Wrapper with Ambient Glow */}
          <div className="relative w-full max-w-[1400px] px-4 flex items-center justify-center z-50">
            {glowFeatureEnabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute -inset-1 rounded-[1.85rem] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-2xl opacity-40 pointer-events-none z-0"
              />
            )}

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`relative w-full bg-[#070709]/95 rounded-3xl overflow-hidden max-h-[92vh] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex z-10 text-zinc-300 transition-all duration-300 ${
                glowFeatureEnabled 
                  ? 'border border-transparent bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 shadow-[0_0_30px_rgba(236,72,153,0.15)]' 
                  : 'border border-zinc-800/80'
              }`}
            >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-900 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-800 bg-zinc-950/40 transition-all cursor-pointer focus:outline-none z-55"
              aria-label="Close Settings"
            >
              <X className="w-4 h-4" />
            </button>

            {/* TWO COLUMN CONTENT AREA */}
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] w-full min-h-[580px] h-[88vh] overflow-hidden select-none">
              
              {/* LEFT COLUMN: SIDEBAR */}
              <div className="bg-zinc-950/60 border-r border-zinc-900 p-6 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar select-none">
                <div className="flex flex-col gap-6">
                  {['Organization', 'Personal'].map((sec) => (
                    <div key={sec} className="flex flex-col gap-1.5">
                      <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-550 font-black px-3 mb-1 select-none font-sans">
                        {sec}
                      </h3>
                      
                      <div className="flex flex-col gap-1">
                        {navItems.filter(item => item.section === sec).map((item) => {
                          const Icon = item.icon;
                          const isSelected = activeSettingsTab === item.id;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveSettingsTab(item.id)}
                              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all text-left focus:outline-none border select-none cursor-pointer duration-200
                                ${isSelected 
                                  ? 'bg-white/5 text-white border-white/[0.08] shadow-sm relative overflow-hidden' 
                                  : 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
                                }
                              `}
                            >
                              {/* Active vertical bar accent */}
                              {isSelected && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
                              )}
                              
                              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                              <span className="font-sans tracking-wide truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* LOG OUT BUTTON AT BOTTOM OF SIDEBAR */}
                <div className="pt-4 border-t border-zinc-900 mt-4">
                  <button
                    onClick={() => {
                      triggerToast('Logging out...');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer focus:outline-none text-left"
                  >
                    <X className="w-4 h-4 text-white/30 shrink-0 rotate-45" />
                    <span className="font-sans">Log out</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: MAIN PANEL VIEW */}
              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar h-full bg-[#08080a]/30 relative">
                
                {/* General Settings Panel */}
                {activeSettingsTab === 'general' && (
                  <div className="flex flex-col gap-8 animate-fadeIn font-sans">
                    {/* Organization details header from user layout */}
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight font-sans">General Settings</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Configure organizational identification, branding parameters, and workspace appearance details.
                      </p>
                    </div>

                    {/* Screenshot layout replication card */}
                    <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-900/60 flex flex-col gap-6 relative">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Organization Profile</h3>
                      
                      {/* Logo field */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-zinc-900/60 gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-zinc-200">Organization Logo</span>
                          <span className="text-xs text-zinc-500">
                            Provide a high-contrast icon as workspace branding avatar.
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {orgLogoImg ? (
                            <img 
                              src={orgLogoImg} 
                              alt="Organization Logo" 
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white/80 text-sm font-bold flex items-center justify-center shrink-0">
                              N
                            </div>
                          )}
                          <input 
                            type="file" 
                            ref={orgLogoInputRef} 
                            onChange={handleOrgLogoChange} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <button 
                            type="button"
                            onClick={() => orgLogoInputRef.current?.click()}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Logo</span>
                          </button>
                        </div>
                      </div>

                      {/* Name input */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-zinc-900/60 gap-4">
                        <div className="flex flex-col gap-0.5 sm:max-w-[40%]">
                          <span className="text-sm font-semibold text-zinc-200">Organization Name</span>
                          <span className="text-xs text-zinc-500">
                            Visible on active sandboxes and dashboard headers.
                          </span>
                        </div>
                        <div className="flex-1 max-w-md w-full flex items-center gap-3">
                          <input 
                            type="text" 
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 font-sans"
                          />
                          <button 
                            onClick={handleSaveGeneralOrg}
                            className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none shrink-0"
                          >
                            Save Name
                          </button>
                        </div>
                      </div>

                      {/* Slug field */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-zinc-900/60 gap-4">
                        <div className="flex flex-col gap-0.5 sm:max-w-[40%]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-zinc-200">Organization slug</span>
                            <span title="Slug acts as customized sub-domain root path.">
                              <Info className="w-3.5 h-3.5 text-zinc-600" />
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500">
                            Your organization's unique sub-domain handle.
                          </span>
                        </div>
                        <div className="flex-1 max-w-md w-full flex items-center gap-3">
                          <div className="relative w-full flex items-center">
                            <span className="absolute left-4 text-xs text-zinc-650 font-mono">lucid.dev/</span>
                            <input 
                              type="text" 
                              value={orgSlug}
                              onChange={(e) => setOrgSlug(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl pl-22 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 font-mono"
                            />
                          </div>
                          <button 
                            onClick={handleSaveGeneralOrg}
                            className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none shrink-0"
                          >
                            Save Slug
                          </button>
                        </div>
                      </div>

                      {/* Organization ID */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
                        <div className="flex flex-col gap-0.5 sm:max-w-[40%]">
                          <span className="text-sm font-semibold text-zinc-200">Organization ID</span>
                          <span className="text-xs text-zinc-500">
                            The identifier allocated to your workspace container.
                          </span>
                        </div>
                        <div className="flex-1 max-w-md w-full flex items-center gap-2">
                          <input 
                            type="text" 
                            readOnly
                            value={orgId}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-500 font-mono outline-none"
                          />
                          <button 
                            onClick={() => handleCopy(orgId, 'Organization ID')}
                            className="p-2.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none shrink-0"
                            title="Copy ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Render original Lucid general components under separate block */}
                    <div className="border-t border-zinc-900/60 pt-6">
                      <GeneralSettings triggerToast={triggerToast} />
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeSettingsTab === 'subscription' && (
                  <div className="animate-fadeIn">
                    <SubscriptionSettings userEmail={user.email} triggerToast={triggerToast} />
                  </div>
                )}

                {/* Teammates Tab */}
                {activeSettingsTab === 'teammates' && (
                  user.plan === 'Pro' || user.plan === 'Business' ? (
                    <div className="flex flex-col gap-8 animate-fadeIn font-sans text-zinc-300">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Teammates</h2>
                        <p className="text-xs text-zinc-400 mt-1">
                          Control authorization matrices, add contributors, or re-route workspace quotas.
                        </p>
                      </div>

                      {/* Invite new teammate form */}
                      <form onSubmit={handleAddTeammate} className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Invite Teammate</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wide">Contributor Email</label>
                            <input 
                              type="email" 
                              placeholder="teammate@example.com"
                              value={newTeammateEmail}
                              onChange={(e) => setNewTeammateEmail(e.target.value)}
                              className="bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-zinc-800 font-sans"
                              required
                            />
                          </div>
                          <div className="w-full sm:w-40 flex flex-col gap-1.5">
                            <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wide">Role Quota</label>
                            <select
                              value={newTeammateRole}
                              onChange={(e) => setNewTeammateRole(e.target.value)}
                              className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-sans"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Member">Member</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="self-end px-5 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-black" />
                          <span>Send Invitation</span>
                        </button>
                      </form>

                      {/* Active list */}
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white px-1">Active Team Members ({teammates.length})</h3>
                        <div className="flex flex-col gap-2">
                          {teammates.map((member) => (
                            <div 
                              key={member.email} 
                              className="p-4 bg-zinc-950/20 border border-zinc-900 rounded-xl flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 text-white/90 text-xs font-bold flex items-center justify-center shrink-0">
                                  {member.name.charAt(0)}
                                </div>
                                <div className="flex flex-col text-left min-w-0">
                                  <span className="text-xs font-bold text-white truncate">{member.name}</span>
                                  <span className="text-[10px] text-zinc-550 font-mono truncate">{member.email}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950 border border-zinc-900 px-2 py-1 rounded-md">
                                  {member.role}
                                </span>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                                  ${member.status === 'Active' 
                                    ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                                    : 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                                  }
                                `}>
                                  {member.status}
                                </span>
                                {member.role !== 'Owner' && (
                                  <button
                                    onClick={() => handleRemoveTeammate(member.email)}
                                    className="p-1.5 text-zinc-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Revoke and delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Teammates</h2>
                        <p className="text-xs text-zinc-400 mt-1">
                          Control authorization matrices, add contributors, or re-route workspace quotas.
                        </p>
                      </div>

                      <div className="w-full border border-dashed border-zinc-800 rounded-[2rem] bg-[#070709]/20 flex flex-col items-center justify-center p-8 py-16 md:py-20 text-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <Users className="w-7 h-7 text-zinc-400" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2">
                          <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                            Collaborative pipelines are locked
                          </h3>
                          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <Gem className="w-3 h-3 text-sky-400" />
                            <span>Pro / Business</span>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed px-4">
                          Invite contributors, assign role-based quotas, and compile pipelines synchronously with your team in shared workspaces.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            triggerToast('Redirecting to subscription settings.');
                            setActiveSettingsTab('subscription');
                          }}
                          className="mt-3 px-6 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                        >
                          Upgrade Workspace
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* SSO Tab */}
                {activeSettingsTab === 'sso' && (
                  user.plan === 'Business' ? (
                    <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">Single Sign-On (SSO)</h2>
                          <p className="text-xs text-zinc-400 mt-1">
                            Manage organization identity providers and secure login parameters.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 uppercase tracking-widest text-[9px] font-black bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Enabled</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 p-6 bg-zinc-950/40 border border-zinc-900 rounded-[1.5rem] flex flex-col gap-5">
                          <h3 className="text-sm font-bold text-white">Active Connection Details</h3>
                          
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Identity Provider</span>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-300 flex items-center justify-between">
                              <span className="font-semibold text-white">Okta Enterprise IDP</span>
                              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded font-mono">SAML 2.0</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Entity ID</span>
                              <div className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-300 font-mono truncate">
                                lucid-dev-idp-okta-83f
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">SAML Single Sign-On URL</span>
                              <div className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-300 font-mono truncate">
                                https://okta.lucid.dev/sso/saml2
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">X.509 Certificate (SHA-256 Fingerprint)</span>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-450 font-mono truncate">
                              9A:BC:D1:EF:23:45:67:89:FE:DC:BA:09:87:65:43:21:0A:BC:DE:F0
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-2 border-t border-zinc-900 mt-1">
                            <div className="flex flex-col gap-0.5 max-w-[70%]">
                              <span className="text-xs font-bold text-zinc-200">Enforce SAML SSO for team members</span>
                              <span className="text-[11px] text-zinc-550">
                                Forces all non-admin organization users to sign in exclusively via Okta.
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => triggerToast('Toggled SAML enforcement')}
                              className="w-12 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer bg-white"
                            >
                              <div className="w-5 h-5 rounded-full bg-black transition-transform duration-300 transform translate-x-6" />
                            </button>
                          </div>

                          <div className="flex items-center justify-end gap-3 border-t border-zinc-900 pt-3">
                            <button 
                              type="button"
                              onClick={() => triggerToast('SAML SSO connection test initiated... success!')}
                              className="px-4.5 py-2 border border-zinc-850 hover:border-zinc-800 text-xs font-bold rounded-xl transition-all hover:text-white cursor-pointer bg-transparent"
                            >
                              Test Connection
                            </button>
                            <button 
                              type="button"
                              onClick={() => triggerToast('SSO configurations saved')}
                              className="px-4.5 py-2 bg-white text-black hover:bg-zinc-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Save Settings
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-[1.5rem] flex flex-col gap-5 justify-between">
                          <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-white">Provisioning (SCIM)</h3>
                            <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                              Automate teammate onboarding/offboarding by linking your identity provider directory.
                            </p>
                            <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between gap-3 text-xs">
                              <span className="text-zinc-400 font-sans">SCIM Connector URL</span>
                              <span className="text-zinc-600 font-mono text-[10px]">https://scim.lucid.dev/v2</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => triggerToast('SCIM directory synchronization triggered successfully')}
                            className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900/40 text-xs font-bold text-zinc-300 transition-all text-center cursor-pointer bg-transparent"
                          >
                            Sync Directory Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Single Sign-On</h2>
                      </div>

                      <div className="w-full border border-dashed border-zinc-800 rounded-[2rem] bg-[#070709]/20 flex flex-col items-center justify-center p-8 py-16 md:py-24 text-center gap-5">
                        
                        {/* Shield Icon Badge */}
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <Shield className="w-7 h-7 text-zinc-400" />
                        </div>

                        {/* Header + Business Pill Row */}
                        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2">
                          <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                            No identity providers configured
                          </h3>
                          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            <Gem className="w-3 h-3 text-violet-400" />
                            <span>Business</span>
                          </div>
                        </div>

                        {/* Explanation Description */}
                        <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed px-4">
                          Single sign-on lets your team sign in using your organization's identity provider like Google Workspace, Okta, or Microsoft Entra ID.
                        </p>

                        {/* CTA Upgrade Button */}
                        <button
                          type="button"
                          onClick={() => {
                            triggerToast('Upgrade flow initiated! Redirecting to billing.');
                            addNotification('billing', 'Upgrade Requested', 'Upgrade to Single Sign-On Business plan initiated.');
                            setActiveSettingsTab('subscription');
                          }}
                          className="mt-3 px-6 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                        >
                          Upgrade to Business
                        </button>

                      </div>
                    </div>
                  )
                )}

                {/* Data residency Tab */}
                {activeSettingsTab === 'cloud' && (
                  user.plan === 'Pro' || user.plan === 'Business' ? (
                    <div className="animate-fadeIn">
                      <CloudSettings triggerToast={triggerToast} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                      <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Cloud Infrastructure</h2>
                        <p className="text-xs text-zinc-400 mt-1">
                          Monitor your active server telemetry logs or deploy custom Docker sandbox runtimes.
                        </p>
                      </div>

                      <div className="w-full border border-dashed border-zinc-800 rounded-[2rem] bg-[#070709]/20 flex flex-col items-center justify-center p-8 py-16 md:py-20 text-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <Server className="w-7 h-7 text-zinc-400" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2">
                          <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                            Private compilation nodes are locked
                          </h3>
                          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <Gem className="w-3 h-3 text-sky-400" />
                            <span>Pro / Business</span>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed px-4">
                          Unlock primary compilation routing region selections, hardware-accelerated rendering, and private container sandbox runtimes.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            triggerToast('Redirecting to subscription settings.');
                            setActiveSettingsTab('subscription');
                          }}
                          className="mt-3 px-6 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                        >
                          Upgrade Workspace
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Personal Profile Tab */}
                {activeSettingsTab === 'profile' && (
                  <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Profile</h2>
                    </div>

                    <div className="p-6 bg-[#070709]/40 border border-zinc-900 rounded-2xl flex flex-col gap-6">
                      
                      {/* Profile Image card from Screenshot 2 */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-900/60 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-zinc-200">Profile Image</span>
                          <div className="flex items-center gap-4 mt-2">
                            {profileImg ? (
                              <img 
                                src={profileImg} 
                                alt="Profile Avatar" 
                                className="w-14 h-14 rounded-full object-cover border border-zinc-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-550 shrink-0">
                                <UserIcon className="w-6 h-6 text-zinc-500" />
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <input 
                                type="file" 
                                ref={profileImageInputRef} 
                                onChange={handleProfileImgChange} 
                                accept="image/*" 
                                className="hidden" 
                              />
                              <button 
                                type="button"
                                onClick={() => profileImageInputRef.current?.click()}
                                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  setProfileImg(null);
                                  triggerToast('Avatar removed');
                                }}
                                className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Full Name input field with Save button to the right of it */}
                      <div className="flex flex-col gap-1.5 py-2 border-b border-zinc-900/60">
                        <label className="text-sm font-semibold text-zinc-200">Full Name</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 font-sans"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              triggerToast('Profile name updated');
                              addNotification('info', 'Profile Name Saved', `Full Name is now ${profileName}`);
                            }}
                            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-all border border-zinc-800 cursor-pointer focus:outline-none shrink-0"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Email input field with Change button to the right of it */}
                      <div className="flex flex-col gap-1.5 py-2 border-b border-zinc-900/60">
                        <label className="text-sm font-semibold text-zinc-200">Email</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="email" 
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 font-sans"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              triggerToast('Email verification pending: ' + profileEmail);
                              addNotification('info', 'Verification Link Sent', `Sent a verification token to ${profileEmail}`);
                            }}
                            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-all border border-zinc-800 cursor-pointer focus:outline-none shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Finish sound with switch toggle */}
                      <div className="flex items-center justify-between py-3 border-b border-zinc-900/60">
                        <div className="flex flex-col gap-0.5 max-w-[70%]">
                          <span className="text-sm font-semibold text-zinc-200">Finish sound</span>
                          <span className="text-xs text-zinc-500">
                            Play a sound when the AI finishes a task
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setFinishSoundEnabled(!finishSoundEnabled);
                          }}
                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${finishSoundEnabled ? 'bg-white' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-300 transform ${finishSoundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Premium Multicolor Glow Aura with switch toggle */}
                      <div className="flex items-center justify-between py-3 border-b border-zinc-900/60">
                        <div className="flex flex-col gap-0.5 max-w-[70%]">
                          <span className="text-sm font-semibold text-white flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            <span>Multicolor Glow Aura</span>
                          </span>
                          <span className="text-xs text-zinc-500">
                            Surround active app workspaces with an animated high-fidelity glowing multicolor border.
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setGlowFeatureEnabled(!glowFeatureEnabled);
                          }}
                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${glowFeatureEnabled ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-300 transform ${glowFeatureEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* User ID field with copy icon */}
                      <div className="flex flex-col gap-1.5 py-2">
                        <label className="text-sm font-semibold text-zinc-200">User ID</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            readOnly
                            value="usr_01KWER0H8KS6TS4H3PR1ECMMQC"
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-500 font-mono outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => handleCopy('usr_01KWER0H8KS6TS4H3PR1ECMMQC', 'User ID')}
                            className="p-2.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none shrink-0"
                            title="Copy ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Personal Security Tab */}
                {activeSettingsTab === 'security' && (
                  <div className="flex flex-col gap-6 animate-fadeIn font-sans text-zinc-300">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Security</h2>
                    </div>

                    {/* Passkeys Section from Screenshot 1 */}
                    <div className="p-6 bg-[#070709]/40 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Passkeys</h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          Secure, passwordless authentication for your account
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerToast('Passkey registration initiated');
                          addNotification('info', 'Passkey Setup', 'Passkey registration prompt opened.');
                        }}
                        className="self-start px-4 py-2 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add passkey</span>
                      </button>
                    </div>

                    {/* Linked accounts Section from Screenshot 1 */}
                    <div className="p-6 bg-[#070709]/40 border border-zinc-900 rounded-2xl flex flex-col gap-4">
                      <h3 className="text-lg font-bold text-white tracking-tight">Linked accounts</h3>
                      
                      <div className="border border-zinc-900 rounded-[1.5rem] bg-zinc-950/20 overflow-hidden divide-y divide-zinc-900/60">
                        
                        {/* Google Account */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-850 shrink-0 text-white">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92(3.28-4.74 3.28-8.09)z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                              </svg>
                            </div>
                            <span className="text-xs font-bold text-zinc-100">Google</span>
                            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              Connected
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              triggerToast('Unlinked Google account');
                              addNotification('info', 'Account Unlinked', 'Google federated login unlinked.');
                            }}
                            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Unlink
                          </button>
                        </div>

                        {/* Apple Account */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-850 shrink-0 text-white">
                              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 2.99 1.1.09 2.23-.55 3-1.44z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-bold text-zinc-100">Apple</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              triggerToast('Apple verification connection opened');
                              addNotification('info', 'OAuth Initiated', 'Connecting Apple Federated identity.');
                            }}
                            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Link
                          </button>
                        </div>

                        {/* Microsoft Account */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-850 shrink-0 text-white">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022"/>
                                <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00"/>
                                <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A1F1"/>
                                <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
                              </svg>
                            </div>
                            <span className="text-xs font-bold text-zinc-100">Microsoft</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              triggerToast('Microsoft connection initiated');
                              addNotification('info', 'OAuth Initiated', 'Connecting Microsoft Federated identity.');
                            }}
                            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Link
                          </button>
                        </div>

                        {/* X Account */}
                        <div className="flex items-center justify-between p-4 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] border border-zinc-850 shrink-0 text-white">
                              <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-bold text-zinc-100">X</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              triggerToast('X connection initiated');
                              addNotification('info', 'OAuth Initiated', 'Connecting X Federated identity.');
                            }}
                            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Link
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Change Credentials / Password Reset & MFA */}
                    <div className="p-6 bg-[#070709]/40 border border-zinc-900 rounded-2xl flex flex-col gap-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Change Credentials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wide">Current Password</label>
                          <input 
                            type="password" 
                            value={curPassword}
                            onChange={(e) => setCurPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-zinc-550 font-bold uppercase tracking-wide">New Password</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* MFA config */}
                      <div className="flex items-center justify-between py-4 border-t border-zinc-900/60 mt-2">
                        <div className="flex flex-col gap-0.5 max-w-[70%]">
                          <span className="text-sm font-semibold text-zinc-200">Multi-Factor Authentication (MFA)</span>
                          <span className="text-xs text-zinc-500">
                            Secure your developer account by generating a unique dynamic code (Google Authenticator, Authy).
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setMfaEnabled(!mfaEnabled)}
                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${mfaEnabled ? 'bg-white' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-black transition-transform duration-300 transform ${mfaEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSecurity}
                        className="self-end px-5 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
                      >
                        Update Security
                      </button>
                    </div>

                    {/* Active Sessions list */}
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white px-1">Active Login Sessions</h3>
                      <div className="flex flex-col gap-2">
                        <div className="p-4 bg-zinc-950/20 border border-zinc-900 rounded-xl flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-white">macOS Chrome — Lagos, Nigeria</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-mono">IP: 197.210.64.12 — Current Session</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-emerald-500/5 text-emerald-400 border-emerald-500/10">
                            Active
                          </span>
                        </div>

                        <div className="p-4 bg-zinc-950/20 border border-zinc-900 rounded-xl flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-white">iPhone 15 Safari — Lagos, Nigeria</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-mono">IP: 102.89.44.118 — 2 hours ago</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerToast('Logged out of other devices')}
                            className="text-[10px] font-bold text-white hover:text-red-400 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Integrations (MCP) Tab */}
                {activeSettingsTab === 'connectors' && (
                  <div className="animate-fadeIn">
                    <ConnectorsSettings triggerToast={triggerToast} />
                  </div>
                )}

              </div>
            </div>

          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
