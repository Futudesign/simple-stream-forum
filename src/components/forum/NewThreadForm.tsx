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
    <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold text-lg">New Thread</h2>
      <Input
        placeholder="Thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
      />
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={2000}
        required
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Post Thread</Button>
      </div>
    </form>
  );
};

export default NewThreadForm;
