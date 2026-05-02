'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useState } from 'react';

export function NotificationToggle() {
  const { isSupported, permission, subscription, subscribe, unsubscribe } = usePushNotifications();
  const [loading, setLoading] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setLoading(true);
    if (subscription) {
      await unsubscribe();
    } else {
      await subscribe();
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading || permission === 'denied'}
      className="flex items-center gap-2"
    >
      {subscription ? (
        <>
          <BellOff className="h-4 w-4" />
          Desactivar Notificaciones
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Activar Notificaciones
        </>
      )}
    </Button>
  );
}
