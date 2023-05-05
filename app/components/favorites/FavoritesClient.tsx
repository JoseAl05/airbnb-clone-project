'use client';

import { SafeListing, SafeUser } from '@/app/types';
import Container from '../Container';
import Header from '../header/Header';
import ListingCard from '../listings/ListingCard';

interface FavoritesClientProps {
    favoritesListings:SafeListing[];
    currentUser?:SafeUser | null;
}

const FavoritesClient:React.FC<FavoritesClientProps> = ({favoritesListings,currentUser}) => {
    return (
        <Container>
            <Header
                title='Favorites'
                subtitle='List of places you have favorited!'
            />
            <div className='grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                {favoritesListings.map(favoriteListing => {
                    return(
                        <ListingCard
                            key={favoriteListing.id}
                            data={favoriteListing}
                            currentUser={currentUser}
                        />
                    )
                })}
            </div>
        </Container>
    );
}

export default FavoritesClient;