import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import ListingClient from '@/app/components/listings/ListingClient';
import getCurrentUser from '@/app/functions/getCurrentUser';
import getListingById from '@/app/functions/getListingById';
import getReservations from '@/app/functions/getReservations';

interface ListingParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: ListingParams }) => {

    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    const currentUser = await getCurrentUser();

    if(!listing){
        return(
            <ClientOnly>
                <EmptyState/>
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
}

export default ListingPage;