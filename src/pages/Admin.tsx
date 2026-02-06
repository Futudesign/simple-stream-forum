import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getThreads, Thread, Reply, getReplies, updateThread, updateReply, deleteThread, deleteReply, getBlockedIPs, addBlockedIP, removeBlockedIP } from '@/lib/forumStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Pencil, Trash2, Ban, Check, X, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ADMIN_PASSWORD = 'admin123'; // Demo password - change this!
const ADMIN_AUTH_KEY = 'forum_admin_auth';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadReplies, setThreadReplies] = useState<Record<string, Reply[]>>({});
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newIP, setNewIP] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const allThreads = getThreads();
    setThreads(allThreads);
    const repliesMap: Record<string, Reply[]> = {};
    allThreads.forEach(t => {
      repliesMap[t.id] = getReplies(t.id);
    });
    setThreadReplies(repliesMap);
    setBlockedIPs(getBlockedIPs());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  const startEditThread = (thread: Thread) => {
    setEditingThread(thread.id);
    setEditTitle(thread.title);
    setEditContent(thread.content);
  };

  const saveThread = (id: string) => {
    updateThread(id, editTitle, editContent);
    setEditingThread(null);
    loadData();
  };

  const handleDeleteThread = (id: string) => {
    if (confirm('Delete this thread and all its replies?')) {
      deleteThread(id);
      loadData();
    }
  };

  const startEditReply = (reply: Reply) => {
    setEditingReply(reply.id);
    setEditContent(reply.content);
  };

  const saveReply = (id: string) => {
    updateReply(id, editContent);
    setEditingReply(null);
    loadData();
  };

  const handleDeleteReply = (id: string) => {
    if (confirm('Delete this reply?')) {
      deleteReply(id);
      loadData();
    }
  };

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    const ip = newIP.trim();
    if (ip && !blockedIPs.includes(ip)) {
      addBlockedIP(ip);
      setNewIP('');
      loadData();
    }
  };

  const handleRemoveIP = (ip: string) => {
    removeBlockedIP(ip);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Login</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Back
                </Button>
              </div>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="threads">
          <TabsList className="mb-4">
            <TabsTrigger value="threads">Threads ({threads.length})</TabsTrigger>
            <TabsTrigger value="blocked">Blocked IPs ({blockedIPs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="space-y-3">
            {threads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No threads yet</p>
            ) : (
              threads.map((thread) => (
                <Card key={thread.id}>
                  <CardContent className="p-4">
                    {editingThread === thread.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Content"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveThread(thread.id)}>
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingThread(null)}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{thread.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {thread.author} · {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                            </p>
                            <p className="text-sm mt-2 line-clamp-2">{thread.content}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => startEditThread(thread)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteThread(thread.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {(threadReplies[thread.id] || []).length > 0 && (
                          <div className="mt-3 ml-4 border-l-2 border-muted pl-4 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              {threadReplies[thread.id].length} {threadReplies[thread.id].length === 1 ? 'reply' : 'replies'}
                            </p>
                            {threadReplies[thread.id].map((reply) => (
                              <div key={reply.id} className="bg-muted/50 rounded p-3">
                                {editingReply === reply.id ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      rows={2}
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => saveReply(reply.id)}>
                                        <Check className="h-3 w-3 mr-1" /> Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                                        <X className="h-3 w-3 mr-1" /> Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-muted-foreground">
                                        {reply.author} · {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                      </p>
                                      <p className="text-sm mt-1">{reply.content}</p>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEditReply(reply)}>
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteReply(reply.id)}>
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="blocked" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  IP Blocking (Demo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Note: This is a demo feature. Real IP blocking requires a backend server.
                  Add IP addresses here to simulate blocking users.
                </p>
                
                <form onSubmit={handleAddIP} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    pattern="^[\d.]+$"
                  />
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </form>

                {blockedIPs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No blocked IPs</p>
                ) : (
                  <div className="space-y-2">
                    {blockedIPs.map((ip) => (
                      <div key={ip} className="flex items-center justify-between bg-muted rounded px-3 py-2">
                        <code className="text-sm">{ip}</code>
                        <Button size="sm" variant="ghost" onClick={() => handleRemoveIP(ip)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;