
import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import Producto from '../componentes/cardProducto';



export default function Index() {

  //obtener productos de graphql
  const{data,loading,error}=useQuery(OBTENER_PRODUCTOS);
  if (loading) {
    return 'cargando....'
  }

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light mb-4 '>Productos</h1>
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

