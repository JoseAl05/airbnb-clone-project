'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';


const Logo = () => {

    const router = useRouter();

    return (
        <Image alt='logo' className='hidden cursor-pointer md:block' height='50' width='50' src='/images/logo.png' />
    );
}

export default Logo;