
import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';


export default function Empresa() {

  
  return (
    <div>
      <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Crear Empresa</h1>
      </Layout>
    </div>
  )
}
