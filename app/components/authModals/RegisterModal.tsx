'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form'

import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from '../Modal';
import ModalHeader from './ModalHeader';
import Input from '../inputs/Input';
import Button from '../buttons/Button';
import useLoginModal from '@/app/hooks/useLoginModal';


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        //Axios POST call to register end point
        const signup = axios.post('/api/signup', data);

        toast.promise(signup,{
            success:'Register Complete!',
            loading:'Please wait for the system to register.',
            error:'Something went wrong. Please try again'
        })
        .then(() => {
            registerModal.onClose();
            loginModal.onOpen();
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setIsLoading(false);
        })

    }

    const toggleLogin = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <ModalHeader title='Welcome to Airbnb' subtitle='Create your account' />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} required />
            <Input id='password' label='Password' type='password' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button
                outline
                label='Continue with Google'
                icon={FcGoogle}
                onClick={() => { signIn('google') }}
            />
            <Button
                outline
                label='Continue with Github'
                icon={AiFillGithub}
                onClick={() => { signIn('github') }}
            />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='flex flex-row justify-center items-center gap-2'>
                    <p>
                        Already have an account?
                    </p>
                    <div className='text-neutral-800 cursor-pointer hover:underline' onClick={toggleLogin}>
                        Login
                    </div>
                </div>
            </div>
        </div>
    )


    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Sign Up'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModal;