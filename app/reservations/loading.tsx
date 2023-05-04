'use client';

import { Waveform } from '@uiball/loaders';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
            <Image
                alt='logo'
                src='/images/logo.png'
                height='150'
                width='150'
            />
            <Waveform
                size={40}
                lineWeight={3.5}
                speed={1}
                color="black"
            />
        </div>
    )
}