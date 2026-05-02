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
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={handleToggle}
          disabled={loading || permission === 'denied'}
          className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center h-10 w-10"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#22c55e]" />
          ) : isEnabled ? (
            <Bell className="h-5 w-5 text-[#22c55e]" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          {isEnabled && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#0f0f0f]" />
          )}
        </button>
        {isIOS && !isStandalone && (
          <p className="text-[9px] text-yellow-500/70 text-center leading-tight">
            Para recibir avisos en iPhone, pulsa "Compartir" y luego "Añadir a pantalla de inicio".
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
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
        
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold leading-tight">
            {isEnabled ? "Notificaciones Activas" : "Activar Notificaciones"}
          </span>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
            {permission === 'denied' ? "Permiso bloqueado" : isEnabled ? "Recibiendo alertas" : "Mantente al tanto"}
          </span>
        </div>

        {isEnabled && (
          <div className="ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        )}
      </button>
      {isIOS && !isStandalone && (
        <div className="px-2 py-1.5 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
          <p className="text-[10px] text-yellow-500/80 leading-relaxed text-center">
            ⚠️ <b>iPhone detectado:</b> Debes "Añadir a pantalla de inicio" para que funcionen las notificaciones.
          </p>
        </div>
      )}
    </div>
  );
}
