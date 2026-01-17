import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setUsername } from '@/lib/forumStorage';

interface UsernamePromptProps {
  onUsernameSet: (username: string) => void;
}

const UsernamePrompt = ({ onUsernameSet }: UsernamePromptProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      setUsername(trimmed);
      onUsernameSet(trimmed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-card border rounded-lg p-8 shadow-sm max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome to the Forum</h1>
        <p className="text-muted-foreground text-center mb-6">Enter a username to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
          />
          <Button type="submit" className="w-full">
            Enter Forum
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernamePrompt;
