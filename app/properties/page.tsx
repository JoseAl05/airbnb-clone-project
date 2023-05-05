import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
import PropertiesClient from '../components/properties/PropertiesClient';

import getCurrentUser from '../functions/getCurrentUser';
import getListings from '../functions/getListings';

const PropertiesPage = async() => {

    const currentUser = await getCurrentUser();

    if(!currentUser){
        return (
            <ClientOnly>
                <EmptyState
                    title='Unauthorized'
                    subtitle='Pleas log in!'
                />
            </ClientOnly>
        )
    }

    const properties = await getListings({
        userId:currentUser.id
    });

    if(properties.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title='No properties found'
                    subtitle='Looks like you have not properties'
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <PropertiesClient
                properties={properties}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default PropertiesPage;