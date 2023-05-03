'use client';

import useCountries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';
import Header from '../header/Header';
import Image from 'next/image';
import HeartButton from '../buttons/HeartButton';

interface ListingHeaderProps {
    id:string;
    title:string;
    imgSrc:string;
    locationValue:string;
    currentUser?:SafeUser | null;
}

const ListingHeader:React.FC<ListingHeaderProps> = ({id,title,imgSrc,locationValue,currentUser}) => {

    const { getByValue } = useCountries();

    const location = getByValue(locationValue);

    return (
        <>
            <Header
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div className='relative w-full h-[60vh] rounded-xl overflow-hidden'>
                <Image
                    className='object-cover w-full'
                    alt='Listing Image'
                    src={imgSrc}
                    fill
                />
                <div className='absolute top-5 right-5'>
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                    />
                </div>
            </div>

        </>
    );
}

export default ListingHeader;