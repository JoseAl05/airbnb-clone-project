'use client';

import { useMemo, useState } from 'react';
import useRentModal from '@/app/hooks/useRentModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Modal from '../Modal';
import ModalHeader from '../authModals/ModalHeader';
import { categories } from '../categories/Categories';
import CategoryInput from '../categories/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


enum STEPS {
    category = 0,
    location = 1,
    info = 2,
    images = 3,
    description = 4,
    price = 5
}

const RentModal = () => {

    const router = useRouter();

    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.category);
    const [isLoading,setIsLoading] = useState(false);

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

    //Import MAP component dynamically to rendered on every "locationSelected" change
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
    //Go back to the previous step
    const onBack = () => {
        setStep((value) => value - 1);
    }

    //Advance to the next step
    const onNext = () => {
        setStep((value) => value + 1);
    }

    //On submit the listing after the user reach the last step
    const onSubmit:SubmitHandler<FieldValues> = (data) =>{
        if(step !== STEPS.price){
            return onNext();
        }
        setIsLoading(true);

        axios.post('/api/listing',data)
        .then(() => {
            toast.success('Listing Created!');
            router.refresh();
            reset();
            setStep(STEPS.category);
            rentModal.onClose();
        })
        .catch(() => {
            toast.error('Something went wrong. Please try again.')
        })
        .finally(() =>{
            setIsLoading(false);
        })
    }

    //Set the text of the "submit" button depending on the step
    const actionLabel = useMemo(() => {
        if (step === STEPS.price) {
            return 'Create';
        }

        return 'Next';
    }, [step])

    //Set the text of the "back" button depending on the step
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.category) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    //FIRST STEP
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

    //SECOND STEP
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

    //THIRD STEP
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

    //FOURTH STEP
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

    //FIFTH STEP
    if(step === STEPS.description){
        bodyContent=(
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='How you would describe your place?'
                    subtitle='Short and sweet works best!'
                />
                <Input
                    id='title'
                    label='Title'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr/>
                <Input
                    id='description'
                    label='Description'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    //SIXTH STEP
    if(step === STEPS.price){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <ModalHeader
                    title='Now, set your price'
                    subtitle='How much do you charge per night?'
                />
                <Input
                    id='price'
                    label='Price'
                    formatPrice={true}
                    type='number'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return (
        <Modal
            title='Aribnb your home!'
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.category ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default RentModal;