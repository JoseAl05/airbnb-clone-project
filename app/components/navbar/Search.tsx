'use client';

import useCountries from '@/app/hooks/useCountries';
import useSearchModal from '@/app/hooks/useSearchModal';
import { differenceInDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';

const Search = () => {

    const searchModal = useSearchModal();
    const params = useSearchParams();
    const { getByValue } = useCountries();

    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');

    const locationLabel = useMemo(() => {
        if(locationValue){
            return getByValue(locationValue as string)?.label;
        }

        return 'Anywhere'
    },[getByValue,locationValue]);

    const dateLabel = useMemo(() => {
        if(startDate && endDate){
            const start = new Date(startDate as string);
            const end = new Date (endDate as string);

            let diff =  differenceInDays(end,start);

            if(diff === 0){
                diff = 1;
            }

            return `${diff} Days`;
        }

        return 'Any week';
    },[startDate,endDate]);

    const guestLabel = useMemo(() => {
        if(guestCount){
            return `${guestCount} Guests`;
        }

        return 'Add Guests';
    },[guestCount]);

    return (
        <div onClick={searchModal.onOpen} className='w-full py-2 border-[1px] transition rounded-full shadow-sm cursor-pointer md:w-auto hover:shadow-md'>
            <div className='flex flex-row items-center justify-between'>
                <div className='px-6 text-sm font-semibold'>
                    {locationLabel}
                </div>
                <div className='flex-1 hidden px-6 text-sm font-semibold text-center border-x-[1px] sm:block'>
                    {dateLabel}
                </div>
                <div className='text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3'>
                    <div className='hidden sm:block'>
                        {guestLabel}
                    </div>
                    <div className='p-2 bg-rose-200 rounded-full text-white'>
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;