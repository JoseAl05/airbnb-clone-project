'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../buttons/Button';

interface ListingReservationProps {
    price:number;
    totalPrice:number;
    onChangeDate:(value:Range) => void;
    dateRange:Range;
    onSubmit:() => void;
    disabled?:boolean;
    disabledDates:Date[]
}

const ListingReservation:React.FC<ListingReservationProps> = ({
    price,
    totalPrice,
    onChangeDate,
    dateRange,
    onSubmit,
    disabled,
    disabledDates
}) => {
    return (
        <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
            <div className='flex flex-row items-center gap-1 p-4'>
                <p className='text-2xl font-semibold'>
                    $ {price}
                </p>
                <p className='font-light text-neutral-600'>
                    / night
                </p>
            </div>
            <hr/>
            <Calendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => onChangeDate(value.selection)}
            />
            <hr/>
            <div className='p-4'>
                <Button
                    disabled={disabled}
                    label='Reserve'
                    onClick={onSubmit}
                />
            </div>
            <div className='flex flex-row items-center justify-between p-4 text-lg font-semibold'>
                <p>
                    Total
                </p>
                <p>
                    $ {totalPrice}
                </p>
            </div>
        </div>
    );
}

export default ListingReservation;