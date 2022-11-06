import React from 'react';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import Router from 'next/router';


const ELIMINAR_PRODUCTO = gql`
mutation EliminarProducto($eliminarProductoId: ID!) {
    eliminarProducto(id: $eliminarProductoId)
  }
`;
const OBTENER_PRODUCTOS = gql`
query ObtenerProductos {
  obtenerProductos {
    nombre_producto
    descripcion_producto
    precio
    existencia
    fecha_elaboracion
    fecha_vencimiento
    estado
    tipo_producto
    id
  }
}`;

const TablaProducto = ({producto}) => {

    //mutation para eliminar
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache){
            //obtener copia de cache
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            //reescribir cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter( productoActual => productoActual.id !== id)
                }
            })
        }
    });

    const{nombre_producto,descripcion_producto,precio,existencia,estado,id} = producto;

    //eliminar producto
    const confirmarEliminarProducto= id =>{
        Swal.fire({
            title: 'Desea eliminar este producto?',
            text: "Esta accion no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
          }).then(async(result) => {
            if (result.isConfirmed) {

                try {
                    //eliminar por id
                    const {data} = await eliminarProducto({
                        variables:{
                            "eliminarProductoId": id
                        }
                    })
                    //mostrar alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProducto,
                        'success'
                      )
                } catch (error) {
                    console.log(error)
                }

            }
          })
    };


    const editarProducto =()=>{
        Router.push({
            pathname: "/editarproducto/[id]",
            query:{id}
        })
    };
    return ( 
        <tr>
            <td className='border px-4 py-2'>{nombre_producto}</td>
            <td className='border px-4 py-2'>{descripcion_producto}</td>
            <td className='border px-4 py-2'>{precio} Bs</td>
            <td className='border px-4 py-2'>{existencia}</td>
            <td className='border px-4 py-2'>{estado}</td>
            <td className='border px-4 py-2'>
                <button 
                    type="button" 
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xd uppercase font-bold '
                    onClick={()=>confirmarEliminarProducto(id)}
                    >
                    
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </td>
            <td className="border px-4 py-2"> 
                    <button 
                        type="button"
                        className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={()=> editarProducto()}
                    >
                        Editar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
            </td>

        </tr> 
    )
}
 
export default TablaProducto;