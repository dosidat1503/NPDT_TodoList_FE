
import React from 'react';
import Sidebar from './Sidebar/sidebar';
import useGlobalContext from '../../../context/globalVariables';

interface DefaultLayoutProps {
    children: React.ReactNode;
}

function DefaultLayout({children}: DefaultLayoutProps){
    const { page } = useGlobalContext()!;

    return ( 
        <div className="flex justify-center items-center ">
            <div className="container ">
                <div className='grid md:grid-cols-5 rounded-lg'>
                    <Sidebar />
                    <main className="bg-sky-200 md:col-span-4 rounded-lg p-10">
                        <h1 className='text-3xl font-bold'> { page } </h1> 
                        {children}
                    </main> 
                </div>
            </div>
        </div> 
    )
}
 

export default DefaultLayout;