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
  const EditarProducto = () => {
    //obtener el id actual
    const router = useRouter ();
    const { query:{pid} } = router;

    //consultar para obtener el producto
    const producto = useQuery(OBTENER_PRODUCTO , {
        variables:{
            obtenerProductoId:pid
        }
    });
    const empresas =useQuery(OBTENER_EMPRESAS);
    const productos=useQuery(OBTENER_TIPO_PRODUCTOS);
    
    //mutatios de actualizar
    const [actualizarProducto]=useMutation(ACTUALIZAR_PRODUCTO);

    if(producto.loading) return 'Cargando...';
    if (empresas.loading)  return 'cargando...';
    if (productos.loading) return 'cargando...';
    if(!producto.data) return 'accion no permitida';

    const {obtenerProducto} = producto.data;

    const schemaValidacion = Yup.object({
        nombre_producto : Yup.string()
                .required('El Nombre es Obligatorio')
                .min(3, "El nombre tiene que tener al menos 3 carácteres")
                .max(50, "El nombre no puede superar los 50 carácteres"),
        existencia : Yup.number()
                    .required('La cantidad del producto es Obligatorio')
                    .positive('No se aceptan numeros negativos o "0"')
                    .integer('la existencia debe ser en numeros enteros'),
        precio : Yup.number()
                    .required('El  precio es Obligatorio')
                    .positive('No se aceptan numeros negativos o "0"'), 
        descripcion_producto: Yup.string()
                    .required('La descripcion es obligatoria')
                    .min(3, "La descripcion tiene que tener al menos 3 carácteres")
                    .max(150, "La descripcion no puede superar los 150 carácteres"),
        fecha_elaboracion: Yup.date()
                        .required('La fecha de elaboracion es obligatoria'),
        fecha_vencimiento: Yup.date()
                        .required('La fecha de vencimiento es obligatoria')
                        .min(
                            Yup.ref("fecha_elaboracion"),
                            "La fecha de vencimiento debe ser despues de la de elaboracion"
                        ),
        estado: Yup.string()
                .required('Estado obligatorio'),
        tipo_empresa: Yup.string()
                .required('La empresa es obligatoria'),
        tipo_producto: Yup.string()
                        .required('El tipo de producto es obligatorio'),     
    });
}