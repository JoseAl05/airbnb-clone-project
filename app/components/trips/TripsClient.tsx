'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { SafeReservation, SafeUser } from '@/app/types';
import Container from '../Container';
import Header from '../header/Header';
import { toast } from 'react-hot-toast';
import ListingCard from '../listings/ListingCard';

interface TripsClientProps {
    reservations:SafeReservation[];
    currentUser?:SafeUser | null;
}

const TripsClient:React.FC<TripsClientProps> = ({reservations,currentUser}) => {

    const router = useRouter();

    const [deleteId,setDeleteId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeleteId(id);

        const deleteReservation = axios.delete(`/api/reservation/${id}`);

        toast.promise(deleteReservation,{
            success:'Reservation Cancelled',
            error:'Something went wrong. Please try again!',
            loading:'Deleting...'
        })
        .then(()=>{
            router.refresh();
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setDeleteId('');
        })

    },[router]);

    return (
        <Container>
            <Header
                title='Trips'
                subtitle='Where you have been and where you are going '
            />
            <div className='grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                {reservations.map(reservation => {
                    return (
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={deleteId === reservation.id}
                            actionLabel='Cancel reservation'
                            currentUser={currentUser}
                        />
                    )
                })}
            </div>
        </Container>
    );
}

export default TripsClient;