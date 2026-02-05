import { useState, useEffect } from 'react';
import { getUsername, getLatestThreads, createThread, Thread } from '@/lib/forumStorage';
import UsernamePrompt from './UsernamePrompt';
import ThreadList from './ThreadList';
import NewThreadForm from './NewThreadForm';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';

const Forum = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showNewThread, setShowNewThread] = useState(false);

  const refreshThreads = () => {
    setThreads(getLatestThreads(10));
  };

  useEffect(() => {
    const stored = getUsername();
    if (stored) {
      setUsername(stored);
      refreshThreads();
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

  if (!username) {
    return <UsernamePrompt onUsernameSet={handleUsernameSet} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Simple Forum</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{username}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {showNewThread ? (
            <NewThreadForm
              onSubmit={handleCreateThread}
              onCancel={() => setShowNewThread(false)}
            />
          ) : (
            <Button onClick={() => setShowNewThread(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Thread
            </Button>
          )}

          <div>
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
