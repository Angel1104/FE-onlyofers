
import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import TablaProducto from '../componentes/tablaProducto';
import Link from 'next/link';

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
}`

export default function Productos() {
    //obtener productos de graphql
    const{data,loading,error}=useQuery(OBTENER_PRODUCTOS);
    if (loading) {
      return 'cargando....'
    }
  return (
    <div>
      <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Mis productos</h1>
      
      <Link href="/nuevoproducto">
        <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase fotn-bold text-sm'>
          Nuevo producto
        </a>
      </Link>
      <table className='table-auto shadow-md mt-10 w-full w-lg'>
        <thead className='bg-gray-800'>
          <tr className='text-white'>
            <th className='w1/8 py-2'>Nombre</th>
            <th className='w1/8 py-2'>Descripción</th>
            <th className='w1/8 py-2'>Precio</th>
            <th className='w1/8 py-2'>Stock</th>
            <th className='w1/8 py-2'>Fecha Ven</th>
            <th className='w1/8 py-2'>Estado</th>
            <th className='w1/8 py-2'>Eliminar</th>
            <th className='w1/8 py-2'>Editar</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {data.obtenerProductos.map(producto=>(
            <TablaProducto
              Key={producto.id}
              producto={producto}
            />
          ))}
        </tbody>
      </table>
      
      </Layout>
    </div>
  )
}
