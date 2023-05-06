'use client';
import { DotSpinner } from '@uiball/loaders'
import Image from 'next/image';

const Loader = () => {
    return (
        <div className='h-[70vh] flex flex-col justify-center items-center'>
            <Image
                alt='logo'
                src='/images/logo.png'
                height='150'
                width='150'
                quality={30}
            />
            <DotSpinner
                size={40}
                speed={1.5}
                color="red"
            />
        </div>
    )
}

export default Loader;