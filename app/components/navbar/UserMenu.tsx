'use client';
import { useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { AiOutlineMenu } from 'react-icons/ai';

import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';
import { useRouter } from 'next/navigation';


interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])

    const onRent = useCallback(() => {

        //Check if the user is logged in, if not open the sign in modal.
        if (!currentUser) {
            return loginModal.onOpen();
        }

        // Open Rent Modal.
        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal])

    return (
        <div className='relative'>
            <div className='flex flex-row items-center gap-3'>
                <div
                    onClick={onRent}
                    className='
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        transition
                        cursor-pointer
                        hover:bg-neutral-100

                        '
                >
                    Airbnb your home
                </div>
                <div
                    onClick={toggleOpen}
                    className='
                        p-4
                        md:py-1
                        md:px-2
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        transition
                        hover:shadow-md
                    '
                >
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='text-sm absolute rounded-xl shadow-md w-[40vw] bg-white overflow-hidden right-0 top-12 md:w-3/4'>
                    <div className='flex flex-col cursor-pointer'>
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => router.push('/trips')}
                                    label='My trips'
                                />
                                <MenuItem
                                    onClick={() => router.push('/favorites')}
                                    label='My favorites'
                                />
                                <MenuItem
                                    onClick={() => router.push('/reservations')}
                                    label='My reservations'
                                />
                                <MenuItem
                                    onClick={() => router.push('/properties')}
                                    label='My properties'
                                />
                                <MenuItem
                                    onClick={rentModal.onOpen}
                                    label='Airbnb my home'
                                />
                                <hr />
                                <MenuItem
                                    onClick={() => signOut()}
                                    label='Log out'
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={loginModal.onOpen}
                                    label='Login'
                                />
                                <MenuItem
                                    onClick={registerModal.onOpen}
                                    label='Sign Up'
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;