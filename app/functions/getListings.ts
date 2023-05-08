import prisma from '@/app/libs/prismadb';

export interface IListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      locationValue,
      category,
    } = params;

    let query: any = {};

    //**QUERY FILTERS**//
    if (userId) {
      query.userId = userId;
    }
    if (guestCount) {
      query.guestCount = {
        //Greater Than or Equal
        gte: +guestCount,
      };
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }
    if (locationValue) {
      query.locationValue = {
          contains:locationValue,
      };
    }
    if (category) {
      query.category = category;
    }
    //**END QUERY FILTERS**//
    const listings = await prisma.listing.findMany({
      where:query,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    throw new Error(error);
  }
}
