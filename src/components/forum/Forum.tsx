import { useState, useEffect } from 'react';
import { getUsername, getLatestThreads, createThread, Thread } from '@/lib/forumStorage';
import UsernamePrompt from './UsernamePrompt';
import ThreadList from './ThreadList';
import NewThreadForm from './NewThreadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Settings, Image, X, LogOut, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const BG_KEY = 'forum_background';

const Forum = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [showBgInput, setShowBgInput] = useState(false);
  const [bgUrl, setBgUrl] = useState('');
  const [appliedBg, setAppliedBg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onlineCount = useOnlineUsers(username);
  const refreshThreads = () => {
    setThreads(getLatestThreads(10));
  };

  useEffect(() => {
    const stored = getUsername();
    if (stored) {
      setUsername(stored);
      refreshThreads();
    }
    const savedBg = localStorage.getItem(BG_KEY);
    if (savedBg) {
      setAppliedBg(savedBg);
      setBgUrl(savedBg);
    }
  }, []);

  const handleUsernameSet = (name: string) => {
    setUsername(name);
    refreshThreads();
  };

  const handleCreateThread = (title: string, content: string) => {
    if (username) {
      createThread(title, content, username);
      refreshThreads();
      setShowNewThread(false);
    }
  };

  const handleApplyBg = () => {
    const url = bgUrl.trim();
    localStorage.setItem(BG_KEY, url);
    setAppliedBg(url);
    setShowBgInput(false);
  };

  const handleClearBg = () => {
    localStorage.removeItem(BG_KEY);
    setAppliedBg('');
    setBgUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(BG_KEY, dataUrl);
      setAppliedBg(dataUrl);
      setBgUrl('');
      setShowBgInput(false);
    };
    reader.readAsDataURL(file);
  };

  if (!username) {
    return <UsernamePrompt onUsernameSet={handleUsernameSet} />;
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={appliedBg ? {
        backgroundImage: `url(${appliedBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : undefined}
    >
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight lowercase">futuforum</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {onlineCount <= 1 ? 'Yksi futuilija paikalla.' : `${onlineCount} futuilijaa paikalla!`}
            </span>
            <span className="text-border">·</span>
            <span className="text-sm text-muted-foreground">{username}</span>
            <button
              onClick={() => { localStorage.removeItem('forum_username'); setUsername(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors" title="Admin">
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            {!showNewThread && (
              <>
                <button
                  onClick={() => setShowNewThread(true)}
                  className="text-sm font-medium text-foreground transition-colors flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 hover:bg-foreground hover:text-background"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Thread
                </button>
                <span className="text-border">·</span>
                <button
                  onClick={() => setShowBgInput(!showBgInput)}
                  className="text-sm font-medium text-muted-foreground transition-colors flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 hover:bg-foreground hover:text-background"
                >
                  <Image className="h-3.5 w-3.5" />
                  Background
                </button>
              </>
            )}
          </div>

          {showNewThread && (
            <NewThreadForm
              onSubmit={handleCreateThread}
              onCancel={() => setShowNewThread(false)}
            />
          )}

          {showBgInput && !showNewThread && (
            <div className="border-b border-border pb-6 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Background Image</p>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button onClick={handleApplyBg} size="sm">Apply</Button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0"
                  title="Upload from computer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {appliedBg && (
                  <button onClick={handleClearBg} className="text-muted-foreground hover:text-foreground transition-colors" title="Clear">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className={appliedBg ? 'bg-background/90 backdrop-blur-sm p-6' : ''}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Latest Threads
            </p>
            <ThreadList 
              threads={threads} 
              username={username} 
              onThreadUpdate={refreshThreads} 
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <p className="text-xs text-muted-foreground">Demo only — data stored locally</p>
        </div>
      </footer>
    </div>
  );
};

export default Forum;
