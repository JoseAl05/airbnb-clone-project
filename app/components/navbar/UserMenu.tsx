'use client';
import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import { useState, useCallback } from 'react';
import MenuItem from './MenuItem';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import { signOut } from 'next-auth/react';


interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])

    return (
        <div className='relative'>
            <div className='flex flex-row items-center gap-3'>
                <div
                    onClick={() => { }}
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
                                    onClick={() => { }}
                                    label='My trips'
                                />
                                <MenuItem
                                    onClick={() => { }}
                                    label='My favorites'
                                />
                                <MenuItem
                                    onClick={() => { }}
                                    label='My reservations'
                                />
                                <MenuItem
                                    onClick={() => { }}
                                    label='My properties'
                                />
                                <MenuItem
                                    onClick={() => { }}
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