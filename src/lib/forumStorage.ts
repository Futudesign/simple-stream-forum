export interface Reply {
  id: string;
  threadId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  lastActivityAt: string;
  replyCount: number;
}

const THREADS_KEY = 'forum_threads';
const REPLIES_KEY = 'forum_replies';
const USERNAME_KEY = 'forum_username';
const BLOCKED_IPS_KEY = 'forum_blocked_ips';

export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_KEY);
};

export const setUsername = (username: string): void => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const getThreads = (): Thread[] => {
  const data = localStorage.getItem(THREADS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getLatestThreads = (limit: number = 10): Thread[] => {
  const threads = getThreads();
  return threads
    .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())
    .slice(0, limit);
};

export const getThread = (id: string): Thread | undefined => {
  return getThreads().find(t => t.id === id);
};

export const createThread = (title: string, content: string, author: string): Thread => {
  const threads = getThreads();
  const now = new Date().toISOString();
  const newThread: Thread = {
    id: crypto.randomUUID(),
    title,
    author,
    content,
    createdAt: now,
    lastActivityAt: now,
    replyCount: 0,
  };
  threads.push(newThread);
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  return newThread;
};

export const updateThread = (id: string, title: string, content: string): void => {
  const threads = getThreads();
  const index = threads.findIndex(t => t.id === id);
  if (index !== -1) {
    threads[index].title = title;
    threads[index].content = content;
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  }
};

export const deleteThread = (id: string): void => {
  const threads = getThreads().filter(t => t.id !== id);
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  
  // Also delete all replies for this thread
  const replies = getAllReplies().filter(r => r.threadId !== id);
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies));
};

export const getAllReplies = (): Reply[] => {
  const data = localStorage.getItem(REPLIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getReplies = (threadId: string): Reply[] => {
  return getAllReplies()
    .filter(r => r.threadId === threadId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const createReply = (threadId: string, content: string, author: string): Reply => {
  const allReplies = getAllReplies();
  
  const newReply: Reply = {
    id: crypto.randomUUID(),
    threadId,
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  
  allReplies.push(newReply);
  localStorage.setItem(REPLIES_KEY, JSON.stringify(allReplies));
  
  // Update reply count and last activity
  const threads = getThreads();
  const threadIndex = threads.findIndex(t => t.id === threadId);
  if (threadIndex !== -1) {
    threads[threadIndex].replyCount++;
    threads[threadIndex].lastActivityAt = newReply.createdAt;
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  }
  
  return newReply;
};

export const updateReply = (id: string, content: string): void => {
  const replies = getAllReplies();
  const index = replies.findIndex(r => r.id === id);
  if (index !== -1) {
    replies[index].content = content;
    localStorage.setItem(REPLIES_KEY, JSON.stringify(replies));
  }
};

export const deleteReply = (id: string): void => {
  const replies = getAllReplies();
  const replyToDelete = replies.find(r => r.id === id);
  
  if (replyToDelete) {
    const filteredReplies = replies.filter(r => r.id !== id);
    localStorage.setItem(REPLIES_KEY, JSON.stringify(filteredReplies));
    
    // Update reply count
    const threads = getThreads();
    const threadIndex = threads.findIndex(t => t.id === replyToDelete.threadId);
    if (threadIndex !== -1 && threads[threadIndex].replyCount > 0) {
      threads[threadIndex].replyCount--;
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
    }
  }
};

// Blocked IPs (demo feature)
export const getBlockedIPs = (): string[] => {
  const data = localStorage.getItem(BLOCKED_IPS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addBlockedIP = (ip: string): void => {
  const ips = getBlockedIPs();
  if (!ips.includes(ip)) {
    ips.push(ip);
    localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(ips));
  }
};

export const removeBlockedIP = (ip: string): void => {
  const ips = getBlockedIPs().filter(i => i !== ip);
  localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(ips));
};
