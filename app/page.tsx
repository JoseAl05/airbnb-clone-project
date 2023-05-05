import ClientOnly from './components/ClientOnly';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';
import getCurrentUser from './functions/getCurrentUser';
import getListings, { IListingParams } from './functions/getListings';
import { SafeListing } from './types';

interface HomeProps {
  searchParams:IListingParams;
}

const Home = async({searchParams} : HomeProps) => {

  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  const isEmpty = true;

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className='pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {listings.map((listing: SafeListing) => {
            return (
              <ListingCard
                key={listing.id}
                data={listing}
                currentUser={currentUser}
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home;
