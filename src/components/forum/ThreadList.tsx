import { useState } from 'react';
import { Thread, Reply, getReplies, createReply } from '@/lib/forumStorage';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { renderContentWithEmbeds } from './YouTubeEmbed';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
      <div className="py-16 text-center text-muted-foreground text-sm">
        No threads yet. Be the first to start a discussion.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {threads.map((thread) => {
        const isExpanded = expandedId === thread.id;
        return (
          <div key={thread.id}>
            <div
              onClick={() => handleToggle(thread.id)}
              className="py-5 cursor-pointer group"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                  {thread.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs shrink-0">
                  <MessageSquare className="h-3 w-3" />
                  <span>{thread.replyCount}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {thread.author} · {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </p>
            </div>

            {isExpanded && (
              <div className="pb-6 space-y-5">
                <div className="text-sm leading-relaxed">{renderContentWithEmbeds(thread.content)}</div>

                <div className="border-l-2 border-border pl-5 space-y-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Replies ({replies.length})
                  </p>

                  {replies.map((reply) => (
                    <div key={reply.id} className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {reply.author} · {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </p>
                      <div className="text-sm leading-relaxed">{renderContentWithEmbeds(reply.content)}</div>
                    </div>
                  ))}

                  <form onSubmit={(e) => handleReply(e, thread.id)} className="space-y-3 pt-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                      maxLength={1000}
                      required
                      className="text-sm resize-none"
                    />
                    <Button type="submit" size="sm">Reply</Button>
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
