import { BiSearch } from 'react-icons/bi';

const Search = () => {
    return (
        <div className='w-full py-2 border-[1px] transition rounded-full shadow-sm cursor-pointer md:w-auto hover:shadow-md'>
            <div className='flex flex-row items-center justify-between'>
                <div className='px-6 text-sm font-semibold'>
                    Search
                </div>
                <div className='flex-1 hidden px-6 text-sm font-semibold text-center border-x-[1px] sm:block'>
                    Search 2
                </div>
                <div className='text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3'>
                    <div className='hidden sm:block'>
                        Add Guests
                    </div>
                    <div className='p-2 bg-rose-200 rounded-full text-white'>
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;