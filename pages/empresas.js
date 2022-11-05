import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import TablaEmpresa from '../componentes/tablaEmpresa';
import Link from 'next/link';

const OBTENER_EMPRESAS = gql`
query ObtenerEmpresas {
  obtenerEmpresas {
    nombre_empresa
    numero_sucursal
    direccion_empresa
    telefono
    tipo_empresa
    id
  }
}`

export default function Empresas() {
    //obtener empresas de graphql
    const{data,loading,error}=useQuery(OBTENER_EMPRESAS);
    if (loading) {
      return 'cargando....'
    }
  return (
    <div>
      <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Mis empresas</h1>
      <Link href="/nuevoempresa">
        <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase fotn-bold text-sm'>
          Nueva Empresa
        </a>
      </Link>
      <table className='table-auto shadow-md mt-10 w-full w-lg'>
        <thead className='bg-gray-800'>
          <tr className='text-white'>
            <th className='w1/7 py-2'>Nombre</th>
            <th className='w1/7 py-2'>Sucursal</th>
            <th className='w1/7 py-2'>Direccion</th>
            <th className='w1/7 py-2'>Telefono</th>
            <th className='w1/7 py-2'>Eliminar</th>
            <th className='w1/7 py-2'>Editar</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {data.obtenerEmpresas.map(empresa=>(
            <TablaEmpresa
              Key={empresa.id}
              empresa={empresa}
            />
          ))}
        </tbody>
      </table>
      
      </Layout>
    </div>
  )
}