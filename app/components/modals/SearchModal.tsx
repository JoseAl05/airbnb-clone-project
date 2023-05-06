'use client';

import useSearchModal from '@/app/hooks/useSearchModal';
import Modal from '../Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import dynamic from 'next/dynamic';
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import ModalHeader from '../authModals/ModalHeader';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

enum STEPS {
    location = 0,
    date = 1,
    info = 2
}


const SearchModal = () => {

    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [step,setStep] = useState(STEPS.location);
    const [location,setLocation] = useState<CountrySelectValue>()
    const [guestCount,setGuestCount] = useState(1);
    const [roomCount,setRoomCount] = useState(1);
    const [bathroomCount,setBathroomCount] = useState(1);
    const [dateRange,setDateRange] = useState<Range>({
        startDate:new Date(),
        endDate:new Date(),
        key:'selection'
    })

    const Map = useMemo(() => dynamic(()=>import('../map/Map'),{
        ssr:false
    }),[location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    },[]);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    },[]);

    const onSubmit = useCallback(async() => {
        if(step !== STEPS.info){
            return onNext();
        }

        let currentQuery = {};

        if(params){
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery:any = {
            ...currentQuery,
            locationValue : location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if(dateRange.startDate){
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url:'/',
            query:updatedQuery
        },{skipNull:true})

        setStep(STEPS.location);

        searchModal.onClose();

        router.push(url);

    },[
        bathroomCount,
        guestCount,
        roomCount,
        location?.value,
        dateRange.startDate,
        dateRange.endDate,
        onNext,
        params,
        router,
        searchModal,
        step
    ]);

    const actionLabel = useMemo(() => {
        if(step === STEPS.info){
            return 'Search';
        }

        return 'Next';
    },[step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.location){
            return undefined;
        }

        return 'Back';
    },[step]);

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <ModalHeader
                title='Where do you want to go?'
                subtitle='Find the perfect location!'
            />
            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr/>
            <Map center={location?.latlng} />
        </div>
    );

    if(step === STEPS.date){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='When do you plan to go?'
                    subtitle='Make sure everyone is free!'
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        );
    }

    if(step === STEPS.info) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='More information'
                    subtitle='Find your perfect place!'
                />
                <Counter
                    title='Guests'
                    subtitle='How many guests are coming?'
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <hr/>
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you need?'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <hr/>
                <Counter
                    title='Bathrooms'
                    subtitle='How many bathrooms do you need?'
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title='Filters'
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.location ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModal;