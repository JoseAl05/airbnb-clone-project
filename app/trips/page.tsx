import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
import TripsClient from '../components/trips/TripsClient';

import getCurrentUser from '../functions/getCurrentUser';
import getReservations from '../functions/getReservations';


const TripsPage = async() => {
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return (
            <ClientOnly>
                <EmptyState
                    title='Unauthorized'
                    subtitle='Pleas log in!'
                />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({
        userId:currentUser.id
    });

    if(reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title='No trips found'
                    subtitle='Looks like you have not reserved any trips'
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage;