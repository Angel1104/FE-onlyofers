import React from 'react'
import Link  from "next/link";
import {useRouter} from 'next/router';


const Sidebar = () => {

    //routing de next
    const router = useRouter();
    return ( 
        <>
            <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
                <div>
                    <p className='text-white text-2xl font-black'>OnlyOfers</p>
                </div>
                <nav className='mt-5 list-none '>
                    <li className={router.pathname === "/" || "/empresa" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className='text-white block'>
                            Home
                        </a>   
                    </Link>
                    </li>
                    <li className={router.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/productos">
                    <a className='text-white block'>
                        Productos
                    </a>
                    </Link>
                    </li>
                  
                    <li className={router.pathname === "/empresas" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/empresas">
                    <a className='text-white block'>
                        Empresa
                    </a>
                    </Link>
                    </li>

                    <li className={router.pathname === "/login" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/login">
                    <a className='text-white block'>
                        Iniciar Sesion
                    </a>
                    </Link>
                    </li>

                    
                </nav>
            </aside>
        </>
     );
}
 
export default Sidebar;