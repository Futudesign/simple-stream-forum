import { useState, useEffect } from 'react';
import { getUsername, getLatestThreads, createThread, Thread } from '@/lib/forumStorage';
import UsernamePrompt from './UsernamePrompt';
import ThreadList from './ThreadList';
import NewThreadForm from './NewThreadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, User, Settings, Image, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const BG_KEY = 'forum_background';

const Forum = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [showBgInput, setShowBgInput] = useState(false);
  const [bgUrl, setBgUrl] = useState('');
  const [appliedBg, setAppliedBg] = useState('');

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

  if (!username) {
    return <UsernamePrompt onUsernameSet={handleUsernameSet} />;
  }

  return (
    <div 
      className="min-h-screen bg-muted/30"
      style={appliedBg ? {
        backgroundImage: `url(${appliedBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : undefined}
    >
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Simple Forum</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <Link to="/admin">
              <Button variant="ghost" size="icon" title="Admin">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {showNewThread ? (
              <NewThreadForm
                onSubmit={handleCreateThread}
                onCancel={() => setShowNewThread(false)}
              />
            ) : (
              <>
                <Button onClick={() => setShowNewThread(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Thread
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBgInput(!showBgInput)}
                  className="gap-2"
                >
                  <Image className="h-4 w-4" />
                  Change Background
                  {showBgInput ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          {showBgInput && !showNewThread && (
            <div className="bg-card border rounded-lg p-4 space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Enter a URL for the background image:
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleApplyBg}>Apply</Button>
                {appliedBg && (
                  <Button variant="ghost" size="icon" onClick={handleClearBg} title="Clear background">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className={appliedBg ? 'bg-background/80 backdrop-blur-sm rounded-lg p-4' : ''}>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Latest Threads (showing up to 10)
            </h2>
            <ThreadList 
              threads={threads} 
              username={username} 
              onThreadUpdate={refreshThreads} 
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        Demo only — data is stored locally in your browser
      </footer>
    </div>
  );
};

export default Forum;
