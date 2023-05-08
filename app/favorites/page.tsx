import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';

import getCurrentUser from '../functions/getCurrentUser';
import getFavoriteListings from '../functions/getFavoriteListings';
import FavoritesClient from '../components/favorites/FavoritesClient';

const FavoritesPage = async() => {

    const favoritesListings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if(favoritesListings.length === 0){
        return (
            <ClientOnly>
                <EmptyState
                    title='No favorites found'
                    subtitle='Looks like you have no favorite listings'
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <FavoritesClient
                favoritesListings={favoritesListings}
                currentUser={currentUser | null}
            />
        </ClientOnly>
    )

}

export default FavoritesPage;