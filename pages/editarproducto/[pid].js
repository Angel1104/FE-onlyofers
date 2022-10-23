import React from 'react';
import {useRouter} from 'next/router'
import Layout from '../../componentes/Layout'
import {useQuery,useMutation, gql} from '@apollo/client'
import {Formik} from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ComboEmpresas from '../../componentes/ComboEmpresas';
import ComboProductos from '../../componentes/ComboProductos';

const OBTENER_EMPRESAS = gql`
query ObtenerEmpresas {
    obtenerEmpresas {
      id
      nombre_empresa
    }
  }
`;

const OBTENER_TIPO_PRODUCTOS = gql`
query ObtenerTiposProductos {
    obtenerTiposProductos {
      id
      tipo_producto
    }
  }
`;
const OBTENER_PRODUCTO =gql `
query Query($obtenerProductoId: ID!) {
    obtenerProducto(id: $obtenerProductoId) {
      nombre_producto
      descripcion_producto
      precio
      existencia
      fecha_elaboracion
      fecha_vencimiento
      tipo_producto
      empresa
      estado
    }
  }
`;

const ACTUALIZAR_PRODUCTO=gql`
mutation ActualizarProducto($actualizarProductoId: ID!, $input: ProductoInput) {
    actualizarProducto(id: $actualizarProductoId, input: $input) {
      nombre_producto
      descripcion_producto
      precio
      existencia
      fecha_elaboracion
      fecha_vencimiento
      empresa
      tipo_producto
      estado
    }
  }
  `;