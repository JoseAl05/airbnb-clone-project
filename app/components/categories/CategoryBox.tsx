'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { IconType } from 'react-icons';
import qs from 'query-string';

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {

    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        //Check if there are params
        if (params) {
            //Transform params to an object
            currentQuery = qs.parse(params.toString());
        }

        //Add a category to the current query
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        //If the category is already selected then deselect it.
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        //Create the url with the updated query.
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {
            skipNull: true
        });

        router.push(url);
    }, [label, params, router])

    return (
        <div onClick={handleClick} className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            cursor-pointer
            transition
            hover:text-neutral-800
            ${selected ? 'border-b-neutral-800' : 'border-transparent'}
            ${selected ? 'text-neutral-800' : 'text-neutral-500'}
        `}>
            <Icon size={26} />
            <p className='font-medium text-sm'>
                {label}
            </p>
        </div>
    );
}

export default CategoryBox;