import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/api';
import type { User } from '@/types';

export const useProtectedRoute = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (!storedUser || !token) {
        router.push('/General/LoginPage');
        return;
      }

      setUser(storedUser);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  return { user, isLoading };
};
