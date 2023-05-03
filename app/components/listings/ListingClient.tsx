'use client';

import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { Range } from 'react-date-range';

import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

import { categories } from '../categories/Categories';
import Container from '../Container';
import ListingHeader from './ListingHeader';
import ListingInfo from './ListingInfo';
import ListingReservation from './ListingReservation';
import useLoginModal from '@/app/hooks/useLoginModal';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key:'selection'
};

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing:SafeListing & {
        user:SafeUser
    }
    currentUser?:SafeUser | null;

}

const ListingClient:React.FC<ListingClientProps> = ({reservations = [],listing,currentUser}) => {

    const loginModal = useLoginModal();
    const router = useRouter();

    const [isLoading,setIsLoading] = useState(false);
    const [totalPrice,setTotalPrice] = useState(listing.price);
    const [dateRange,setDateRange] = useState<Range>(initialDateRange);

    const disabledDates = useMemo(() => {
        let dates : Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start:new Date(reservation.startDate),
                end:new Date(reservation.endDate)
            })

            dates = [...dates,...range];
        })

        return dates;
    },[reservations])

    const onCreateReservation = useCallback(() => {
        if(!currentUser){
            return loginModal.onOpen();
        }

        setIsLoading(true);

        axios.post('/api/reservation',{
            totalPrice,
            startDate:dateRange.startDate,
            endDate:dateRange.endDate,
            listingId:listing?.id
        })
        .then(() => {
            toast.success('Listing Reserved!');
            setDateRange(initialDateRange);

            //Redirect to /trips
            router.refresh();
        })
        .catch(()=>{
            toast.error('Something went wrong. Please try again');
        })
        .finally(() => {
            setIsLoading(false);
        })
    },[
        totalPrice,
        dateRange,
        listing?.id,
        router,
        currentUser,
        loginModal
    ])

    useEffect(()=>{
        if(dateRange.startDate && dateRange.endDate){
            const daysCount = differenceInCalendarDays(dateRange.endDate,dateRange.startDate);

            if(daysCount && listing.price){
                setTotalPrice(daysCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    },[dateRange,listing.price])

    const category = useMemo(() => {
        return categories.find((items) => items.label === listing.category);
    },[listing.category])

    return (
        <Container>
            <div className='max-w-screen-lg mx-auto'>
                <div className='flex flex-col gap-6'>
                    <ListingHeader
                        id={listing.id}
                        title={listing.title}
                        imgSrc={listing.imgSrc}
                        locationValue={listing.locationValue}
                        currentUser={currentUser}
                    />
                    <div className='grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10'>
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div className='order-first mb-10 md:order-last md:col-span-3'>
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ListingClient;