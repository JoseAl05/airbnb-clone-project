'use client'

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { SafeListing, SafeUser } from '@/app/types';
import Container from '../Container';
import Header from '../header/Header';
import ListingCard from '../listings/ListingCard';

interface PropertiesClientProps {
    properties: SafeListing[];
    currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({ properties, currentUser }) => {

    const router = useRouter();
    const [deleteId, setDeleteId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeleteId(id);

        const deletePropertie = axios.delete(`/api/listing/${id}`);

        toast.promise(deletePropertie, {
            success: 'Propertie eliminated',
            loading: 'Deleting propertie... Please wait.',
            error: 'Something went wrong. Please try again.'
        })
            .then(() => {
                router.refresh();
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setDeleteId('');
            })
    }, [router])

    return (
        <Container>
            <Header
                title='Properties'
                subtitle='Your Properties'
            />
            <div className='grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                {properties.map(propertie => {
                    return (
                        <ListingCard
                            key={propertie.id}
                            data={propertie}
                            actionId={propertie.id}
                            onAction={onCancel}
                            disabled={deleteId === propertie.id}
                            actionLabel='Delete propertie'
                            currentUser={currentUser}
                        />
                    )
                })}
            </div>
        </Container>
    );
}

export default PropertiesClient;