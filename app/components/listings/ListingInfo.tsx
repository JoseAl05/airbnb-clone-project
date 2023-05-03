'use client';

import dynamic from 'next/dynamic';
import useCountries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';
import { IconType } from 'react-icons';
import ListingCategory from './ListingCategory';
import Avatar from '../Avatar';

const Map = dynamic(() => import('../map/Map'),{
    ssr:false
})

interface ListingInfoProps {
    user: SafeUser;
    description: string;
    roomCount: number;
    guestCount: number;
    bathroomCount: number;
    locationValue: stirng;
    category: {
        icon: IconType;
        label: string;
        description: string;
    };
}

const ListingInfo: React.FC<ListingInfoProps> = ({ user, description, roomCount, guestCount, bathroomCount, locationValue, category }) => {

    const { getByValue } = useCountries();

    const coordinates = getByValue(locationValue)?.latlng;

    return (
        <div className='flex flex-col col-span-4 gap-8'>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-2 text-xl font-semibold'>
                    <h1>Hosted by {user?.name}</h1>
                    <Avatar
                        src={user?.image}
                    />
                </div>
                <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                    {guestCount === 1 ? (
                        <p>{guestCount} guest</p>
                    ):(
                        <p>{guestCount} guests</p>
                    )
                    }
                    {roomCount === 1 ? (
                        <p>{roomCount} room</p>
                    ):(
                        <p>{roomCount} rooms</p>
                    )
                    }
                    {bathroomCount === 1 ? (
                        <p>{bathroomCount} bathroom</p>
                    ):(
                        <p>{bathroomCount} bathrooms</p>
                    )
                    }
                </div>
            </div>
            <hr/>
            {category && (
                <>
                    <ListingCategory
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                </>
            )}
            <hr/>
            <p className='text-lg text-neutral-500 font-light'>
                {description}
            </p>
            <hr/>
            <Map center={coordinates} />
        </div>
    );
}

export default ListingInfo;