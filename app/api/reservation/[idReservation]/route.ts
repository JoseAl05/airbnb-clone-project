import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/functions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { idReservation } = params;

  if (!idReservation || typeof idReservation !== 'string') {
    throw new Error('Invalid ID');
  }

  //Delete reservation by the owner of the property or the user that reserves in that property
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: idReservation,
      OR: [
        { userId: currentUser.id },
        { listing: { userId: currentUser.id } }
    ],
    },
  });

  return NextResponse.json(reservation);
}
