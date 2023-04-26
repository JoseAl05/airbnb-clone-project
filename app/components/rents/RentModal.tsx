'use client';

import { useMemo, useState } from 'react';
import useRentModal from '@/app/hooks/useRentModal';
import { FieldValues, useForm } from 'react-hook-form';

import Modal from '../Modal';
import ModalHeader from '../authModals/ModalHeader';
import { categories } from '../categories/Categories';
import CategoryInput from '../categories/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';


enum STEPS {
    category = 0,
    location = 1,
    info = 2,
    images = 3,
    description = 4,
    price = 5
}

const RentModal = () => {

    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.category);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imgSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const categorySelected = watch('category');
    const locationSelected = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imgSrc = watch('imgSrc');

    const Map = useMemo(() => dynamic(() => import('../map/Map'), {
        ssr: false,
    }), [locationSelected])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.price) {
            return 'Create';
        }

        return 'Next';
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.category) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <>
            <div className='flex flex-col gap-8'>
                <ModalHeader title='Which of these best describes your place?' subtitle='Pick a category' />
                <div className='grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto md:grid-cols-2'>
                    {categories.map(category => {
                        return (
                            <div key={category.label} className='col-span-1'>
                                <CategoryInput
                                    onClick={(inputValue) => setCustomValue('category', inputValue)}
                                    selected={categorySelected === category.label}
                                    label={category.label}
                                    icon={category.icon}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )

    if (step === STEPS.location) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='Where is your place located?'
                    subtitle='Help guests find you!'
                />
                <CountrySelect
                    value={locationSelected}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map center={locationSelected?.latlng} />
            </div>
        )
    }

    if (step === STEPS.info) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='Share some basics about your place'
                    subtitle='What amenities do you have?'
                />
                <Counter
                    title='Guests'
                    subtitle='How many guests do you allow?'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you have?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title='Bathrooms'
                    subtitle='How many bathrooms do you have?'
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    if(step === STEPS.images){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='Add a photo of your place'
                    subtitle='Show guests what your place looks like!'
                />
                <ImageUpload value={imgSrc} onChange={(value) => setCustomValue('imgSrc',value)}/>
            </div>
        )
    }

    return (
        <Modal
            title='Aribnb your home!'
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.category ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default RentModal;