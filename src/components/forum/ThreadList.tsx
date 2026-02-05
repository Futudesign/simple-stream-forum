import { useState } from 'react';
import { Thread, Reply, getReplies, createReply } from '@/lib/forumStorage';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ThreadListProps {
  threads: Thread[];
  username: string;
  onThreadUpdate: () => void;
}

const ThreadList = ({ threads, username, onThreadUpdate }: ThreadListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState('');

  const handleToggle = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setReplies([]);
    } else {
      setExpandedId(id);
      setReplies(getReplies(id));
    }
  };

  const handleReply = (e: React.FormEvent, threadId: string) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const newReply = createReply(threadId, replyContent.trim(), username);
      setReplies([...replies, newReply]);
      setReplyContent('');
      onThreadUpdate();
    }
  };

  if (threads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No threads yet. Be the first to start a discussion!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => {
        const isExpanded = expandedId === thread.id;
        return (
          <div key={thread.id} className="bg-card border rounded-lg overflow-hidden">
            <div
              onClick={() => handleToggle(thread.id)}
              className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-muted-foreground">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
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

            {isExpanded && (
              <div className="border-t px-4 py-4 space-y-4 bg-muted/30">
                <p className="whitespace-pre-wrap">{thread.content}</p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Replies ({replies.length})
                  </h4>

                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-background border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">{reply.author}</span>
                        {' · '}
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}

                  <form onSubmit={(e) => handleReply(e, thread.id)} className="space-y-2 pt-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                      maxLength={1000}
                      required
                    />
                    <Button type="submit" size="sm">Post Reply</Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThreadList;
