import { ClientMessageList } from '@/components/messages/client-message-list';
import { MainLayout } from '@/components/layout/main-layout';

export default function MessagesPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Client Messages</h1>
        <ClientMessageList />
      </div>
    </MainLayout>
  );
}
