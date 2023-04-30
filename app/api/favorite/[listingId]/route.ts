import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/functions/getCurrentUser';
import { NextResponse } from 'next/server';

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoritesIds = [...(currentUser.favoritesIds || [])];

  favoritesIds.push(listingId);

  const userUpdated = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoritesIds,
    },
  });

  return NextResponse.json(userUpdated);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoritesIds = [...(currentUser.favoritesIds || [])];

  favoritesIds = favoritesIds.filter((favoriteId) => favoriteId !== listingId);

  const userUpdated = await prisma.user.update({
    where:{
        id:currentUser.id
    },
    data:{
        favoritesIds
    }
  });

  return NextResponse.json(userUpdated);
}
