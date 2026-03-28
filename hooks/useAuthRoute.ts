import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { getToken } from '@/api/keychain';

export function useProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = await getToken('userToken');
      if (!token && isMounted) {
        router.replace('/login');
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);
}

export function usePublicRoute() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = await getToken('userToken');
      if (token && isMounted) {
        router.replace('/(tabs)/business');
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);
}
