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
  replyCount: number;
}

const THREADS_KEY = 'forum_threads';
const REPLIES_KEY = 'forum_replies';
const USERNAME_KEY = 'forum_username';

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
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getThread = (id: string): Thread | undefined => {
  return getThreads().find(t => t.id === id);
};

export const createThread = (title: string, content: string, author: string): Thread => {
  const threads = getThreads();
  const newThread: Thread = {
    id: crypto.randomUUID(),
    title,
    author,
    content,
    createdAt: new Date().toISOString(),
    replyCount: 0,
  };
  threads.push(newThread);
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  return newThread;
};

export const getReplies = (threadId: string): Reply[] => {
  const data = localStorage.getItem(REPLIES_KEY);
  const allReplies: Reply[] = data ? JSON.parse(data) : [];
  return allReplies
    .filter(r => r.threadId === threadId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const createReply = (threadId: string, content: string, author: string): Reply => {
  const data = localStorage.getItem(REPLIES_KEY);
  const allReplies: Reply[] = data ? JSON.parse(data) : [];
  
  const newReply: Reply = {
    id: crypto.randomUUID(),
    threadId,
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  
  allReplies.push(newReply);
  localStorage.setItem(REPLIES_KEY, JSON.stringify(allReplies));
  
  // Update reply count
  const threads = getThreads();
  const threadIndex = threads.findIndex(t => t.id === threadId);
  if (threadIndex !== -1) {
    threads[threadIndex].replyCount++;
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  }
  
  return newReply;
};
