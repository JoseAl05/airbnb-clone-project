import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLoginModal from './useLoginModal';

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoritesIds || [];

    return list?.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }
      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorite/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorite/${listingId}`);
        }

        await request();

        if((await request()).config.method === 'post'){
          toast.success('Added to favorites!');
        }else{
          toast.success('Removed from favorites!');
        }

        router.refresh();

      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
