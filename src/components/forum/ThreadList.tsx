import { Thread } from '@/lib/forumStorage';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface ThreadListProps {
  threads: Thread[];
  onThreadClick: (id: string) => void;
}

const ThreadList = ({ threads, onThreadClick }: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No threads yet. Be the first to start a discussion!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onThreadClick(thread.id)}
          className="bg-card border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{thread.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                by <span className="font-medium">{thread.author}</span>
                {' · '}
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm shrink-0">
              <MessageSquare className="h-4 w-4" />
              <span>{thread.replyCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
