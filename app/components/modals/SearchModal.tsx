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
import Counter from '../inputs/Counter';
import CategoryInput from '../categories/CategoryInput';
import {categories} from '../categories/Categories';

enum STEPS {
    category = 0,
    location = 1,
    info = 2
}


const SearchModal = () => {

    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [step, setStep] = useState(STEPS.category);
    const [categorySelected, setCategorySelected] = useState();
    const [location, setLocation] = useState<CountrySelectValue>()
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);

    const Map = useMemo(() => dynamic(() => import('../map/Map'), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.info) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
            category:categorySelected
        };


        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })

        setStep(STEPS.category);

        searchModal.onClose();

        router.push(url);

    }, [
        bathroomCount,
        guestCount,
        roomCount,
        location?.value,
        categorySelected,
        onNext,
        params,
        router,
        searchModal,
        step
    ]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.info) {
            return 'Search';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.category) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <ModalHeader title='Which of these best describes your place?' subtitle='Pick a category' />
            <div className='grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto md:grid-cols-2'>
                {categories.map(category => {
                    return (
                        <div key={category.label} className='col-span-1'>
                            <CategoryInput
                                onClick={(value) => setCategorySelected(value)}
                                selected={categorySelected === category.label}
                                label={category.label}
                                icon={category.icon}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )

    if (step === STEPS.location) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='Where do you want to go?'
                    subtitle='Find the perfect location!'
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setLocation(value as CountrySelectValue)}
                />
                <hr />
                <Map center={location?.latlng} />
            </div>
        );
    }

    if (step === STEPS.info) {
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
                <hr />
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you need?'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <hr />
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
            secondaryAction={step === STEPS.category ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModal;