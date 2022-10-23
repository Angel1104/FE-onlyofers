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
    
    
    //modificar el producto en la bd
    const actualizarInfoProducto = async valores =>{
        console.log(valores)
        const {nombre_producto, descripcion_producto, precio, existencia, fecha_elaboracion,fecha_vencimiento,tipo_producto,empresa,estado} = valores;
            try {
                const {data} = await actualizarProducto({
                    variables:{
                        actualizarProductoId:pid,
                        input : {
                            nombre_producto,
                            descripcion_producto,
                            precio,
                            existencia,
                            fecha_elaboracion,
                            fecha_vencimiento,
                            tipo_producto,
                            empresa,
                            estado
                        } 
                    }
                });
                console.log(data)
                Swal.fire(
                    'Actualizado!',
                    'Producto Actualizado correctamente',
                    'success'
                  )
                router.push('/productos');
                
            } catch (error) {
                console.log(error)
            }
    }
    return ( 
        <Layout>
        <h1 className="text-2xl text-gray-800 font-ligth">Editar Producto</h1>
        <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg">

                <Formik
                    enableReinitialize
                    initialValues={obtenerProducto}
                    validationSchema={schemaValidacion }
                    onSubmit={ valores=>{
                        actualizarInfoProducto(valores);
                    } }
                >
                {props => {
                    return(
                        <form
                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={props.handleSubmit}
                >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_producto">
                                    Nombre
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre_producto"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    value={props.values.nombre_producto}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.nombre_producto && props.errors.nombre_producto ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombre_producto}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad disponible
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad disponible"
                                    value={props.values.existencia}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.existencia && props.errors.existencia ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.existencia}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    type="number"
                                    placeholder="Precio"
                                    value={props.values.precio}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.precio && props.errors.precio ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.precio}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion_producto">
                                    Descripción
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="descripcion_producto"
                                    type="text"
                                    placeholder="Descripcion del producto"
                                    value={props.values.descripcion_producto}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.descripcion_producto && props.errors.descripcion_producto ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.descripcion_producto}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_elaboracion">
                                    Fecha de Elaboracion
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_elaboracion"
                                    type="date"
                                    //value={props.values.fecha_elaboracion}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.fecha_elaboracion && props.errors.fecha_elaboracion ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.fecha_elaboracion}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_vencimiento">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="fecha_vencimiento"
                                    type="date"
                                    //value={props.values.fecha_vencimiento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.fecha_vencimiento && props.errors.fecha_vencimiento ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.fecha_vencimiento}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                    Estado del producto
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="estado"
                                    value={props.values.estado}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    <option>DISPONIBLE</option>
                                    <option>TERMINADO</option>
                                </select>
                            </div>
                            {
                                props.touched.estado && props.errors.estado ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.estado}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                    Empresa
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="empresa"
                                    value={props.values.empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    {empresas.data.obtenerEmpresas.map(empresa=>(
                                        <ComboEmpresas
                                            key={empresa.id}
                                            empresa={empresa}
                                        />
                                    ))}
                                </select>
                            </div>
                            {
                                props.touched.empresa && props.errors.empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.empresa}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo_producto">
                                    Tipo de producto
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="tipo_producto"
                                    value={props.values.tipo_producto}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    {productos.data.obtenerTiposProductos.map(TipoProducto =>(
                                        <ComboProductos
                                            key={TipoProducto.id}
                                            TipoProducto ={TipoProducto }
                                        />
                                    ))}
                                </select>
                            </div>
                            {
                                props.touched.tipo_producto && props.errors.tipo_producto ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.tipo_producto}</p>
                                    </div>
                                ) : null
                            }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Editar Producto"
                            />
                </form>
                    );
                }}
                </Formik>
            </div>
        </div>
        </Layout>
     );
}
 
export default EditarProducto;