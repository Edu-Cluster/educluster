import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { User } from '../../types';
import useStore from '../utils/store';
import { trpc } from '../utils/trpc';

type AuthMiddlewareProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  enableAuth?: boolean;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  requireAuth,
  enableAuth,
}) => {
  console.log('I was called from AuthMiddleware');
  const store = useStore();
  const queryClient = useQueryClient();
  const query = trpc.useQuery(['auth.refresh'], {
    enabled: false,
    retry: 1,
    onError(error: any) {
      store.setPageLoading(false);
      document.location.href = '/login';
    },
    onSuccess(data: any) {
      store.setPageLoading(false);
      queryClient.refetchQueries(['user.me']);
    },
  });
  const { isLoading, isFetching } = trpc.useQuery(['user.me'], {
    onSuccess: (data) => {
      store.setPageLoading(false);
      store.setAuthUser(data.data.user as User);
    },
    retry: 1,
    enabled: !!enableAuth,
    onError(error) {
      store.setPageLoading(false);
      if (error.message.includes('must be logged in')) {
        query.refetch({ throwOnError: true });
      }
    },
  });

  const loading =
    isLoading || isFetching || query.isLoading || query.isFetching;

  useEffect(() => {
    if (loading) {
      store.setPageLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return <>{children}</>;
};

export default AuthMiddleware;
