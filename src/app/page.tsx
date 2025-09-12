import { ChatContainer } from '@/components/chat/ChatContainer';
import '../styles/chat-theme.css';

export default function Home() {
  return (
    <main className="h-screen">
      <ChatContainer />
    </main>
  );
}