import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewThreadFormProps {
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
}

const NewThreadForm = ({ onSubmit, onCancel }: NewThreadFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-border pb-8 space-y-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">New Thread</p>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
        className="text-lg font-semibold border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
      />
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={2000}
        required
        className="text-sm resize-none"
      />
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
        <Button type="submit" size="sm">Post</Button>
      </div>
    </form>
  );
};

export default NewThreadForm;
