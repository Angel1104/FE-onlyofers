import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import Producto from '../componentes/cardProducto';
import Empresa from '../componentes/cardEmpresa';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
query ObtenerProductos {
  obtenerProductos {
    id
    nombre_producto
    descripcion_producto
    precio
    existencia
  }
}`

export default function Index() {

  //obtener productos de graphql
  const{data,loading,error}=useQuery(OBTENER_PRODUCTOS);
  if (loading) {
    return 'cargando....'
  }

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light mb-4 '>Empresas</h1>
        <Link href="/">
        <a className='bg-blue-800 mr-5 py-3 px-5 mt-4 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-6 rounded uppercase fotn-bold text-sm'>
          Productos
        </a>
      </Link>
      <Link href="/empresa">
        <a className='bg-blue-800 py-3 px-5 mt-1 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-6 rounded uppercase fotn-bold text-sm'>
          Empresas
        </a>
      </Link>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-10">
            {data.obtenerProductos.map(producto=>(
              <Producto
                Key={producto.id}
                producto={producto}
              />
            ))}

    </div>

      </Layout>
    </div>
  )
}

//para empresas
const OBTENER_EMPRESAS = gql`
query obtenerEmpresa {
  obtenerEmpresa {
    id
    nombre_empresa
    numero_sucursal
    descripcion_empresa
    telefono
  }
}`