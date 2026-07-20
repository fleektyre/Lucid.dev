import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, User, Mail, Link as LinkIcon, HelpCircle, 
  ChevronDown, UserPlus, Check, Loader2, RefreshCw 
} from 'lucide-react';
import { 
  collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../../../lib/firebase/client';
import { useStudioStore } from '../../store/useStudioStore';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Collaborator {
  id: string;
  email: string;
  role: 'Editor' | 'Viewer' | 'No access';
  status: 'Pending' | 'Accepted';
  invitedBy: string;
  createdAt: any;
}

// Global/In-memory Cache for Google Access Token
let googleAccessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('google_access_token') : null;
let googleUserEmailCached: string | null = typeof window !== 'undefined' ? localStorage.getItem('google_user_email') : null;

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ isOpen, onClose }) => {
  const { currentProject, addNotification } = useStudioStore();
  const [emailInput, setEmailInput] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [inviteRole, setInviteRole] = useState<'Editor' | 'Viewer'>('Editor');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkAccess, setLinkAccess] = useState<'No access' | 'Viewer' | 'Editor'>('No access');
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  // Google Auth & Gmail state
  const [isGoogleConnected, setIsGoogleConnected] = useState(!!googleAccessToken);
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(googleUserEmailCached);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Sync Google credentials on load or change (using both localStorage and Firestore for cross-frame syncing)
  useEffect(() => {
    if (!isOpen) return;

    // First attempt: check localStorage
    const storedToken = localStorage.getItem('google_access_token');
    const storedEmail = localStorage.getItem('google_user_email');
    if (storedToken) {
      googleAccessToken = storedToken;
      setIsGoogleConnected(true);
      setGoogleUserEmail(storedEmail);
    }

    // Second attempt: subscribe to Firestore user document for cross-tab / cross-frame real-time synchronization
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.google_access_token) {
          googleAccessToken = data.google_access_token;
          localStorage.setItem('google_access_token', data.google_access_token);
          if (data.google_user_email) {
            localStorage.setItem('google_user_email', data.google_user_email);
            setGoogleUserEmail(data.google_user_email);
          }
          setIsGoogleConnected(true);
        }
      }
    }, (error) => {
      console.warn("Firestore user sync warning in ShareProjectModal:", error);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  const modalRef = useRef<HTMLDivElement>(null);

  // Track Firebase Auth state reactively
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Proactive anonymous auth fallback if not authenticated
  useEffect(() => {
    if (isOpen && !currentUser) {
      signInAnonymously(auth).catch((err) => {
        console.error("Anonymous sign-in in ShareProjectModal failed: ", err);
      });
    }
  }, [isOpen, currentUser]);

  // Close modals on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Sync real-time collaborators from Firestore
  useEffect(() => {
    if (!isOpen || !currentProject?.id || !currentUser) return;

    const colRef = collection(db, 'projects', currentProject.id, 'collaborators');
    
    const unsubscribe = onSnapshot(colRef, 
      (snapshot) => {
        const list: Collaborator[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Collaborator);
        });
        setCollaborators(list);
      },
      (error) => {
        console.error("Firestore collaborators read error: ", error);
        // Fallback to memory list if permissions fail or rules aren't deployed
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentProject?.id, currentUser]);

  // Connect Google account to activate Gmail Send capability
  const connectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://mail.google.com/');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      provider.addScope('https://www.googleapis.com/auth/gmail.compose');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        googleAccessToken = token;
        localStorage.setItem('google_access_token', token);
        localStorage.setItem('google_user_email', result.user.email || '');
        
        // Write to Firestore so that the iframe can access it (bypassing storage partitioning)
        if (result.user) {
          try {
            const userRef = doc(db, 'users', result.user.uid);
            await setDoc(userRef, {
              google_access_token: token,
              google_user_email: result.user.email || '',
              fullName: result.user.displayName || '',
              email: result.user.email || '',
              updatedAt: new Date()
            }, { merge: true });
          } catch (dbErr) {
            console.error('Failed to store Google credentials in Firestore:', dbErr);
          }
        }

        setIsGoogleConnected(true);
        setGoogleUserEmail(result.user.email);
        addNotification('info', 'Google Integration Active', `Connected as ${result.user.email} with Gmail permissions.`);
      } else {
        throw new Error('Failed to retrieve access token.');
      }
    } catch (error: any) {
      console.warn('Google Auth Status:', error.message || error);
      if (error.code === 'auth/popup-closed-by-user' || error.message?.includes('popup-closed-by-user')) {
        addNotification('error', 'Popup Blocked or Closed', 'Popups are restricted within iframes. Please use the "Open in New Tab to Connect" button below.');
      } else {
        addNotification('error', 'Google Connection Failed', error.message || 'Please enable popups or try again.');
      }
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Base64Url encode helper for standard browser JS
  const base64url = (str: string): string => {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // Send Invitation via Gmail API
  const sendGmailInvite = async (recipientEmail: string, role: string) => {
    if (!googleAccessToken) {
      console.warn('Skipping email send: No Google access token available.');
      return;
    }

    try {
      const senderEmail = googleUserEmail || auth.currentUser?.email || 'me';
      const senderName = auth.currentUser?.displayName || 'A Lucid Workspace Collaborator';
      const projectName = currentProject?.name || 'Untitled Project';
      const projectUrl = window.location.origin;

      const emailLines = [];
      
      // Ensure From header is syntactically valid; if it's 'me' or lacks '@', omit it so Gmail defaults it correctly
      if (senderEmail && senderEmail.includes('@')) {
        emailLines.push(`From: ${senderName} <${senderEmail}>`);
      }
      
      emailLines.push(`To: ${recipientEmail}`);
      emailLines.push(`Subject: Collaborate on "${projectName}" with Lucid`);
      emailLines.push(`Content-Type: text/html; charset=utf-8`);
      emailLines.push(`MIME-Version: 1.0`);
      emailLines.push('');
      emailLines.push(`
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #fafafa; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 28px; font-weight: 700; color: #ffffff; font-family: 'Instrument Serif', Georgia, serif; font-style: italic;">lucid.dev</span>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
            <strong style="color: #ffffff;">${senderName}</strong> has invited you to collaborate on their project <strong style="color: #ffffff;">"${projectName}"</strong> as an <strong style="color: #ffffff;">${role}</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${projectUrl}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-weight: 600; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-size: 14px; transition: opacity 0.2s;">
              Join Workspace Project
            </a>
          </div>
          <p style="font-size: 12px; color: #71717a; margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 16px;">
            This invitation was initiated from Lucid.dev using Google Workspace Gmail integrations. If you do not recognize this request, you can safely ignore this email.
          </p>
        </div>
      `);

      const rawEmail = base64url(emailLines.join('\r\n'));

      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: googleAccessToken,
          raw: rawEmail
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gmail API proxy error body:', errText);
        let parsedErrorMsg = '';
        try {
          const parsed = JSON.parse(errText);
          parsedErrorMsg = parsed.error?.message || parsed.message || '';
        } catch (_) {}
        throw new Error(parsedErrorMsg || response.statusText || 'Gmail Proxy Error');
      }

      console.log(`Successfully sent email invite to ${recipientEmail}`);
    } catch (err: any) {
      console.error('Failed to send Gmail invitation email:', err);
      addNotification('error', 'Gmail Invite Failed', `Gmail Error: ${err.message || err}. Please try reconnecting Google.`);
    }
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleAddEmailChip = (emailStr: string) => {
    const trimmed = emailStr.trim().toLowerCase();
    if (!trimmed) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      addNotification('error', 'Invalid Email', `"${trimmed}" is not a valid email address.`);
      return;
    }

    if (invitedEmails.includes(trimmed)) {
      addNotification('info', 'Duplicate Email', `"${trimmed}" is already added.`);
      return;
    }

    setInvitedEmails(prev => [...prev, trimmed]);
  };

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ',', ' ', 'Tab'].includes(e.key)) {
      e.preventDefault();
      const value = emailInput.trim().replace(/,/g, '');
      if (value) {
        handleAddEmailChip(value);
        setEmailInput('');
      }
    } else if (e.key === 'Backspace' && !emailInput && invitedEmails.length > 0) {
      setInvitedEmails(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleRemoveEmailChip = (emailToRemove: string) => {
    setInvitedEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  // Add multiple collaborators to Firestore and trigger Gmail invites
  const handleSendInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add any remaining text in emailInput as a chip first
    let finalEmails = [...invitedEmails];
    const remainingText = emailInput.trim().replace(/,/g, '');
    if (remainingText) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(remainingText)) {
        if (!finalEmails.includes(remainingText)) {
          finalEmails.push(remainingText);
        }
      } else {
        addNotification('error', 'Invalid Email', `"${remainingText}" is not a valid email address.`);
        return;
      }
    }

    if (finalEmails.length === 0) {
      addNotification('error', 'No Recipients', 'Please enter at least one valid email to invite.');
      return;
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const email of finalEmails) {
        // Skip if already collaborating to prevent duplicates
        if (collaborators.some(c => c.email === email)) {
          continue;
        }

        const colId = email.replace(/[.@]/g, '_');
        const docRef = doc(db, 'projects', currentProject.id, 'collaborators', colId);
        
        const newCol: Omit<Collaborator, 'id'> = {
          email,
          role: inviteRole,
          status: 'Pending',
          invitedBy: googleUserEmail || auth.currentUser?.email || 'fleetyre77@gmail.com',
          createdAt: serverTimestamp()
        };

        await setDoc(docRef, newCol);

        // Trigger actual Gmail send if Google integration is active
        if (isGoogleConnected) {
          await sendGmailInvite(email, inviteRole);
        }
        successCount++;
      }

      if (isGoogleConnected) {
        addNotification('info', 'Invites Sent', `Successfully sent ${successCount} invitation email(s) via Gmail.`);
      } else {
        addNotification('info', 'Collaborators Added', `Successfully added ${successCount} collaborator(s) to the project.`);
      }

      setInvitedEmails([]);
      setEmailInput('');
    } catch (error: any) {
      console.error('Send invites failed:', error);
      addNotification('error', 'Send Invites Failed', 'An error occurred while adding or inviting collaborators.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update collaborator role
  const handleUpdateRole = async (colId: string, role: 'Editor' | 'Viewer' | 'No access') => {
    try {
      const docRef = doc(db, 'projects', currentProject.id, 'collaborators', colId);
      await updateDoc(docRef, { role });
      addNotification('info', 'Role Updated', `Collaborator role updated to ${role}.`);
    } catch (err) {
      console.error('Update role failed:', err);
    }
  };

  // Remove collaborator
  const handleRemoveCollaborator = async (colId: string, email: string) => {
    const confirmed = window.confirm(`Remove ${email} from this project?`);
    if (!confirmed) return;

    try {
      const docRef = doc(db, 'projects', currentProject.id, 'collaborators', colId);
      await deleteDoc(docRef);
      addNotification('info', 'Collaborator Removed', `Removed ${email} from project access.`);
    } catch (err) {
      console.error('Delete collaborator failed:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('info', 'Link Copied', 'Project link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            ref={modalRef}
            className="relative w-full max-w-[480px] bg-black rounded-[2rem] border border-white/10 shadow-[0_24px_100px_rgba(0,0,0,0.9)] p-7 overflow-hidden font-body text-zinc-300"
          >
            {/* Subtle top ambient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-heading text-white italic tracking-tight leading-none">Share your project</h3>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 font-body font-medium"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </button>
                <button className="text-zinc-500 hover:text-zinc-400 focus:outline-none transition-all cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google / Gmail Integration Banner */}
            {isGoogleConnected ? (
              <div className="mb-6 p-4 rounded-[1.25rem] bg-zinc-950/40 border border-emerald-500/10 flex items-center gap-2.5 text-xs text-zinc-400 font-body">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span>Invites will send automatically via Google as <strong>{googleUserEmail || auth.currentUser?.email}</strong></span>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-[1.25rem] bg-zinc-950 border border-white/[0.05] flex flex-col gap-3.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-sm bg-red-500 animate-pulse" />
                    <span className="text-zinc-400 font-body font-medium">
                      Gmail Send is inactive
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={connectGoogle}
                    disabled={isConnectingGoogle}
                    className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-body font-medium transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
                  >
                    {isConnectingGoogle ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    <span>Activate Gmail</span>
                  </button>
                </div>

                {typeof window !== 'undefined' && window.self !== window.top && (
                  <div className="text-[11px] text-amber-400 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex flex-col gap-2 font-body">
                    <span>Popups are blocked inside iframes. Click below to open the IDE in a new tab to activate Gmail connection successfully:</span>
                    <a 
                      href={window.location.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs text-black font-semibold bg-white hover:bg-zinc-200 transition-all px-4 py-2 rounded-full mt-1 shadow-md"
                    >
                      Open in New Tab to Connect
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Email Input section */}
            <form onSubmit={handleSendInvites} className="mb-6">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2 ml-1 font-body">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enter a list of emails</span>
              </div>

              {/* Tag/Chip Input Box */}
              <div className="w-full min-h-[60px] bg-zinc-950 rounded-[1rem] border border-white/10 p-2.5 flex flex-wrap items-center gap-2 focus-within:border-white/20 transition-all">
                {invitedEmails.map((email) => (
                  <div 
                    key={email} 
                    className="flex items-center gap-1.5 bg-[#121214] border border-zinc-800 rounded-lg pl-3 pr-2 py-1.5 text-xs text-white group animate-fadeIn"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmailChip(email)}
                      className="text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer focus:outline-none font-bold"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <input 
                  type="text" 
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  onKeyDown={handleEmailInputKeyDown}
                  placeholder={invitedEmails.length === 0 ? "user@example.com" : ""}
                  className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none h-8 font-body"
                  autoComplete="off"
                />
              </div>

              {/* Dropdown Role Selector and Send Invite Button */}
              <div className="flex items-center justify-between mt-4 px-1">
                <div className="relative flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 font-body">Invite as:</span>
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center gap-1 text-xs text-white font-medium hover:text-zinc-300 transition-all focus:outline-none font-body"
                  >
                    <span>{inviteRole}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {showRoleDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
                      <div className="absolute left-0 mt-8 w-28 bg-black border border-white/10 rounded-xl p-1 shadow-[0_8px_30px_rgba(0,0,0,0.95)] z-50 text-xs">
                        {(['Editor', 'Viewer'] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setInviteRole(role);
                              setShowRoleDropdown(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                          >
                            <span>{role}</span>
                            {inviteRole === role && <Check className="w-3 h-3 text-white" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (invitedEmails.length === 0 && !emailInput.trim())}
                  className="px-6 py-2.5 bg-[#1d84fe] hover:bg-blue-600 text-white font-bold text-xs rounded-full transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send invite</span>
                  )}
                </button>
              </div>
            </form>

            {/* Section heading */}
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold uppercase mb-3 ml-2 font-body">
              Project Access
            </div>

            {/* Link access row */}
            <div className="relative flex items-center justify-between py-3.5 px-4 rounded-[1.25rem] bg-zinc-950 border border-white/[0.04] hover:bg-white/[0.02] transition-all mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white font-body">Anyone with the link</div>
                </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowLinkDropdown(!showLinkDropdown)}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-all focus:outline-none font-body"
                >
                  <span>{linkAccess}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showLinkDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLinkDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-32 bg-black border border-white/10 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] z-50 font-body text-xs">
                      {(['No access', 'Viewer', 'Editor'] as const).map((access) => (
                        <button
                          key={access}
                          onClick={() => {
                            setLinkAccess(access);
                            setShowLinkDropdown(false);
                            addNotification('info', 'Link Access Modified', `Public access changed to ${access}.`);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center justify-between"
                        >
                          <span>{access}</span>
                          {linkAccess === access && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Collaborator list */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {/* Owner/Self row */}
              <div className="flex items-center justify-between py-2.5 px-3.5 rounded-[1.25rem] bg-zinc-950 border border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white truncate max-w-[180px] font-body">
                      {auth.currentUser?.email || 'fleetyre77@gmail.com'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-body">Owner</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 font-medium px-3.5 py-1 bg-white/5 border border-white/10 rounded-full font-body">
                  Editor
                </div>
              </div>

              {/* Dynamic Invites/Collaborators list */}
              {collaborators.map((col) => (
                <div key={col.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-[1.25rem] bg-zinc-950 border border-white/[0.03] hover:bg-white/[0.01] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[180px] font-body">{col.email}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 font-medium border border-white/[0.04] font-body">
                          {col.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdownId(activeDropdownId === col.id ? null : col.id)}
                      className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-all focus:outline-none font-body"
                    >
                      <span>{col.role}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {activeDropdownId === col.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)} />
                        <div className="absolute right-0 mt-2 w-32 bg-black border border-white/10 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] z-50 font-body text-xs">
                          {(['Editor', 'Viewer', 'Remove'] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setActiveDropdownId(null);
                                if (opt === 'Remove') {
                                  handleRemoveCollaborator(col.id, col.email);
                                } else {
                                  handleUpdateRole(col.id, opt);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg transition-all flex items-center justify-between ${
                                opt === 'Remove' ? 'text-red-400 hover:text-red-300 hover:bg-red-500/5' : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span>{opt}</span>
                              {col.role === opt && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
