import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
import ReservationClient from '../components/reservations/ReservationClient';

import getCurrentUser from '../functions/getCurrentUser';
import getReservations from '../functions/getReservations';

const ReservationsPage = async() => {
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
        authorId: currentUser.id
    })

    if(reservations.length === 0){
        return(
            <ClientOnly>
                <EmptyState
                    title='No reservations found'
                    subtitle='Looks like you have no reservations on your properties'
                />
            </ClientOnly>
        )
    }

    return(
        <ClientOnly>
            <ReservationClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

    return (
        <div>
            Enter
        </div>
    );
}

export default ReservationsPage;