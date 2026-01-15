import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIAssistant } from '@/components/ai/AIAssistant';

export default function AssistantPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) return null;

  return (
    <DashboardLayout>
      <AIAssistant />
    </DashboardLayout>
  );
}
