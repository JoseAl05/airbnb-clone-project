'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';


const Logo = () => {

    const router = useRouter();

    return (
        <Image onClick={() => router.push('/')} alt='logo' className='hidden cursor-pointer md:block' height='125' width='125' src='/images/logo.png' />
    );
}

export default Logo;