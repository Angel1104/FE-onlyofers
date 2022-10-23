
import Layout from '../componentes/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useQuery, useMutation,gql} from '@apollo/client';
import Producto from '../componentes/cardProducto';

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

