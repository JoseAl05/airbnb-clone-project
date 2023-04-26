'use client';

import { useCallback } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

interface CounterProps{
    title:string;
    subtitle:string;
    value:number;
    onChange:(value: number) => void;
}

const Counter:React.FC<CounterProps> = ({title,subtitle,value,onChange}) => {

    const onAdd = useCallback(() => {
        onChange(value + 1);
    },[onChange,value])

    const onReduce = useCallback(() => {
        if(value === 1){
            return;
        }
        onChange(value - 1);
    },[onChange,value])

    return (
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
                <h1 className='font-medium'>
                    {title}
                </h1>
                <h2 className='font-light text-gray-600'>
                    {subtitle}
                </h2>
            </div>
            <div className='flex flex-row items-center gap-4'>
                <div
                    onClick={onReduce}
                    className='w-10 h-10 p-2 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer transition hover:opacity-80'
                >
                    <AiOutlineMinus/>
                </div>
                <p className='font-light text-xl text-neutral-600'>
                    {value}
                </p>
                <div
                    onClick={onAdd}
                    className='w-10 h-10 p-2 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer transition hover:opacity-80'
                >
                    <AiOutlinePlus/>
                </div>
            </div>

        </div>

    );
}

export default Counter;