'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleOneTap() {
  const { user, admin } = useAuth();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    // Don't show if: already signed in, no client ID configured, or already initialized
    if (user || admin || !GOOGLE_CLIENT_ID || initialized.current) return;
    initialized.current = true;

    const loadAndInit = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) return;
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
            });
            if (!error) {
              router.refresh();
              router.push('/account');
            } else {
              console.error('Google sign-in error:', error.message);
            }
          } catch (e) {
            console.error('Google One Tap error:', e);
          }
        },
        use_fedcm_for_prompt: true,
        cancel_on_tap_outside: true,
        context: 'signin',
      });

      // Delay slightly so it doesn't fight with page render
      setTimeout(() => {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap was suppressed (user previously dismissed) — silent fail is fine
            console.log('One Tap not displayed:', notification.getNotDisplayedReason?.() ?? notification.getSkippedReason?.());
          }
        });
      }, 1500);
    };

    // Load the Google Identity Services script
    if (window.google?.accounts?.id) {
      loadAndInit();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = loadAndInit;
      document.head.appendChild(script);
    }

    return () => {
      // Cancel prompt on unmount
      window.google?.accounts?.id?.cancel?.();
    };
  }, [user, admin, router]);

  return null; // Renders nothing — One Tap shows its own native UI
}
