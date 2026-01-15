import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EquipmentList } from '@/components/equipment/EquipmentList';

export default function EquipmentPage() {
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
      <EquipmentList />
    </DashboardLayout>
  );
}
