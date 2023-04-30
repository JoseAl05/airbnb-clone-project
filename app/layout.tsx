import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/authModals/RegisterModal';
import LoginModal from './components/authModals/LoginModal';
import Navbar from './components/navbar/Navbar';
import './globals.css'
import { Nunito } from 'next/font/google';
import ToastrProvider from './providers/ToastrProvider';
import getCurrentUser from './functions/getCurrentUser';
import RentModal from './components/rents/RentModal';

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Project',
}

const font = Nunito({
  subsets: ['latin']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();

  return (
    <html lang='en'>
      <body className={font.className}>
        <ClientOnly>
          <ToastrProvider />
          <RentModal />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
      </body>
    </html>
  )
}
