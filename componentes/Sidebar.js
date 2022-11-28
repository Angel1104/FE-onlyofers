import React from 'react'
import Link  from "next/link";
import {useRouter} from 'next/router';


const Sidebar = () => {

    //routing de next
    const router = useRouter();
    const path = router.pathname;
    const home = () => {
        var resh;
        if ( path === "/" || path === "/empresa") {
            resh = true
        } else {
            resh = false
        }
        return resh
    };
    const producto = () => {
        var resp;
        if ( path === "/productos" || path === "/nuevoproducto") {
            resp = true
        } else {
            resp = false
        }
        return resp
    };
    const empresa = () => {
        var rese;
        if ( path === "/empresas" || path === "/nuevaempresa") {
            rese = true
        } else {
            rese = false
        }
        return rese
    };

    const iniciarSesion = () =>{
        var resIS;
        if ( path === "/iniciarsesionve" || path === "/login"|| path === "/nuevacuenta" || path === "/nuevovendedor") {
            resIS = true
        } else {
            resIS = false
        }
        return resIS
    }
    return ( 
        <>
            <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
                <div>
                    <p className='text-white text-2xl font-black'>OnlyOfers</p>
                </div>
                <nav className='mt-5 list-none '>
                    <li className={home() ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className='text-white block'>
                            Home
                        </a>   
                    </Link>
                    
                    </li>
                    <li className={producto() ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/productos">
                    <a className='text-white block'>
                        Productos
                    </a>
                    </Link>
                    </li>
                    <li className={empresa() ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/empresas">
                    <a className='text-white block'>
                        Empresa
                    </a>
                    </Link>
                    </li>                    
                    <li className={iniciarSesion() ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/iniciarsesionve">
                    <a className='text-white block'>
                        Iniciar Sesión
                    </a>
                    </Link>
                    </li>
                </nav>
            </aside>
        </>
     );
}
 
export default Sidebar;