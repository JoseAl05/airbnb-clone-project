'use client';

import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useCallback,useState } from 'react';
import { useRouter } from 'next/navigation';


import { SafeReservation, SafeUser } from '@/app/types';

import Header from '../header/Header';
import Container from '../Container';
import ListingCard from '../listings/ListingCard';

interface ReservationClientProps {
    reservations:SafeReservation[];
    currentUser?:SafeUser | null;
}

const ReservationClient:React.FC<ReservationClientProps> = ({reservations,currentUser}) => {

    const router = useRouter();
    const [deleteId,setDeleteId] = useState('');

    const onCancel = useCallback((id:string) => {
        setDeleteId(id);

        const deleteReservation = axios.delete(`/api/reservation/${id}`);

        toast.promise(deleteReservation,{
            success:'Reservation cancelled',
            loading:'Cancelling reservation... Please wait.',
            error:'Something went wrong. Please try again.'
        })
        .then(() => {
            router.refresh();
        })
        .catch((error) =>{
            console.log(error);
        })
        .finally(()=>{
            setDeleteId('');
        })
    },[router])

    return (
        <Container>
            <Header
                title='Reservations'
                subtitle='Bookings on your properties'
            />
            <div className='grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                {reservations.map(reservation => {
                    return(
                        <ListingCard
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={deleteId === reservation.id}
                            actionLabel='Cancel guest reservation'
                            currentUser={currentUser}
                        />
                    )
                })}
            </div>
        </Container>
    );
}

export default ReservationClient;