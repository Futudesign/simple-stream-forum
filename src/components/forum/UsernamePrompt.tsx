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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-sm w-full mx-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight lowercase">futuforum</h1>
          <p className="text-sm text-muted-foreground">Enter a username to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
            className="text-center"
          />
          <Button type="submit" className="w-full">
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernamePrompt;
