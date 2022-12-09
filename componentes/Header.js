import React,{useEffect} from 'react';
import {useQuery, gql} from '@apollo/client'
import {useRouter} from 'next/router'

const OBTENER_CLIENTE_TOKEN =gql`
query ObtenerClienteToken {
    obtenerClienteToken {
      id
      nombre_cliente
      apellido_cliente
      correo_cliente
      contrasenia_cliente
    }
  }
`;

const OBTENER_VENDEDOR_TOKEN =gql`
query ObtenerVendedorToken {
    obtenerVendedorToken {
      id
      nombre_vendedor
      apellido_vendedor
      correo_vendedor
      contrasenia_vendedor
      NIT
    }
  }
`;


const Header = () => {

    //routing next
    const router = useRouter();

    //query de apollo 
    const {data, loading, error,startPolling,stopPolling}= useQuery(OBTENER_VENDEDOR_TOKEN);

    useEffect(() => {
        startPolling(500);
        return()=>{
            stopPolling();
        }
      }, [startPolling, stopPolling])

    //proteger que no accedamos a data antes de tener resultados
    if(loading)return 'Cargando...' ;

    //si no hay informacion del usuario 
    if(!data){
        return(
            router.push('/iniciarsesionve')
        )
    };

    const {nombre_vendedor, apellido_vendedor, NIT}=data.obtenerUsuario;

    const cerrarSesion =()=>{
        localStorage.removeItem('token');
        router.push('/iniciarsesionve');
    };

    return ( 
        <div className="sm:flex sm:justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0">Hola: {nombre_vendedor} {apellido_vendedor} NIT: {NIT}</p>
            <button 
                onClick={()=> cerrarSesion()}
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
                type="button"
            >
                Cerrar Sesion
            </button>
        </div>
     );
}
 
export default Header;