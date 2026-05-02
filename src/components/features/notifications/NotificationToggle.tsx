'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NotificationToggleProps {
  isMobile?: boolean;
}

export function NotificationToggle({ isMobile }: NotificationToggleProps) {
  const { isSupported, permission, subscription, subscribe, unsubscribe } = usePushNotifications();
  const [loading, setLoading] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (subscription) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEnabled = !!subscription;

  if (isMobile) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading || permission === 'denied'}
        className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-[#22c55e]" />
        ) : isEnabled ? (
          <Bell className="h-5 w-5 text-[#22c55e]" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-400" />
        )}
        {isEnabled && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#22c55e] rounded-full animate-ping" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || permission === 'denied'}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
        isEnabled 
          ? "bg-[#22c55e]/5 border border-[#22c55e]/20 text-[#22c55e]" 
          : "bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg transition-colors",
        isEnabled ? "bg-[#22c55e]/10" : "bg-white/5 group-hover:bg-white/10"
      )}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEnabled ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold leading-tight">
          {isEnabled ? "Notificaciones Activas" : "Activar Notificaciones"}
        </span>
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
          {isEnabled ? "Recibiendo alertas" : "Mantente al tanto"}
        </span>
      </div>

      {isEnabled && (
        <div className="ml-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
      )}
    </button>
  );
}
