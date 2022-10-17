
import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import TablaEmpresa from '../componentes/tablaEmpresa';

const OBTENER_EMPRESAS = gql`
query ObtenerEmpresas {
  obtenerEmpresas {
    nombre_empresa
    numero_sucursal
    direccion_empresa
    telefono
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
    <h1 className='text-2xl text-gray-800 font-light'>Mis Empresas</h1>
    <table className='table-auto shadow-md mt-10 w-full w-lg'>
      <thead className='bg-gray-800'>
        <tr className='text-white'>
          <th className='w1/6 py-2'>Nombre</th>
          <th className='w1/6 py-2'>Sucursal</th>
          <th className='w1/6 py-2'>Direccion</th>
          <th className='w1/6 py-2'>Telefono</th>
          <th className='w1/6 py-2'>Eliminar</th>
          <th className='w1/6 py-2'>Editar</th>
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
