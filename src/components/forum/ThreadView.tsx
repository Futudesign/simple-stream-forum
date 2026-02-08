import { useState } from 'react';
import { Thread, Reply, getReplies, createReply } from '@/lib/forumStorage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { renderContentWithEmbeds } from './YouTubeEmbed';
import { formatDistanceToNow } from 'date-fns';

interface ThreadViewProps {
  thread: Thread;
  username: string;
  onBack: () => void;
}

const ThreadView = ({ thread, username, onBack }: ThreadViewProps) => {
  const [replies, setReplies] = useState<Reply[]>(() => getReplies(thread.id));
  const [replyContent, setReplyContent] = useState('');

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const newReply = createReply(thread.id, replyContent.trim(), username);
      setReplies([...replies, newReply]);
      setReplyContent('');
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to threads
      </Button>

      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-xl font-bold">{thread.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          by <span className="font-medium">{thread.author}</span>
          {' · '}
          {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
        </p>
        <div className="mt-4">{renderContentWithEmbeds(thread.content)}</div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Replies ({replies.length})</h2>
        
        {replies.map((reply) => (
          <div key={reply.id} className="bg-muted/50 border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">{reply.author}</span>
              {' · '}
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </p>
            <div>{renderContentWithEmbeds(reply.content)}</div>
          </div>
        ))}

        <form onSubmit={handleReply} className="space-y-3 pt-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            maxLength={1000}
            required
          />
          <Button type="submit">Post Reply</Button>
        </form>
      </div>
    </div>
  );
};

export default ThreadView;
