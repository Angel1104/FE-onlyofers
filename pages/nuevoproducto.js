import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation,gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import ComboEmpresas from '../componentes/ComboEmpresas';
import ComboProductos from '../componentes/ComboProductos';

const NUEVO_PRODUCTO=gql`
mutation nuevoProducto($input: ProductoInput){
    nuevoProducto (input : $input){
        id
        nombre_producto
        descripcion_producto
        precio
        existencia
        fecha_elaboracion
        fecha_vencimiento
        creado
        tipo_producto
        empresa
        estado
    }
  }
`;

const OBTENER_PRODUCTOS= gql`
query ObtenerProductos {
    obtenerProductos {
      nombre_producto
      descripcion_producto
      precio
      existencia
      fecha_elaboracion
      fecha_vencimiento
      empresa
      estado
      tipo_producto
      id
    }
  }
`;

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

const NuevoProducto = () => {
    //routing
    const router = useRouter();

    //mutation para crear producto
    const  [nuevoProducto ]= useMutation(NUEVO_PRODUCTO, {
        update(cache, { data:{nuevoProducto}}){
            // obtener el objeto de cache que deseamos actualizar
            const { obtenerProductos} = cache.readQuery({ query: OBTENER_PRODUCTOS});

            // reeescriibr el cache( el cache nunca se debe modificar se reescribe)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos : [...obtenerProductos , nuevoProducto]
                }
            })
        }
    });

    

    const formik = useFormik({
        initialValues:{
            nombre : '',
            descripcion: '',
            existencia: '',
            precio:'',
            fecha_elaboracion:'',
            fecha_vencimiento:'',
            estado: 'DISPONIBLE',
            empresa: '',
            tipo_producto: ''
        },
        validationSchema: Yup.object({
            nombre : Yup.string()
                    .required('El Nombre es Obligatorio'),
            existencia : Yup.number()
                        .required('La cantidad existente es Obligatorio')
                        .positive('No se aceptan numeros negativos')
                        .integer('la existencia debe ser en numeros enteros'),
            precio : Yup.number()
                        .required('El  precio es Obligatorio')
                        .positive('No se aceptan numeros negativos'), 
            descripcion: Yup.string()
                        .required('La descripcion es obligatoria'),
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
            empresa: Yup.string()
                    .required('La empresa es obligatoria'),
            tipo_producto: Yup.string()
                            .required('El tipo es obligaorio')
            
        }),
        onSubmit: async valores => {
            const {nombre, descripcion, precio, existencia, fecha_elaboracion,fecha_vencimiento,tipo_producto,empresa,estado} = valores;
            try {
                const {data} = await nuevoProducto({
                    variables:{
                        input : {
                            nombre_producto: nombre,
                            descripcion_producto: descripcion,
                            precio: precio,
                            existencia: existencia,
                            fecha_elaboracion: fecha_elaboracion,
                            fecha_vencimiento: fecha_vencimiento,
                            tipo_producto: tipo_producto,
                            empresa: empresa,
                            estado:estado
                        } 
                    }
                });
                //producto creado correctamente mostrar mensaje
                
                Swal.fire(
                    'Creado!',
                    'Producto creado correctamente',
                    'success'
                )
                router.push('/productos');
                
            } catch (error) {
                console.log(error)
            }
        }
    });

    // obtener productos de graphql
    const empresas =useQuery(OBTENER_EMPRESAS);
    const productos=useQuery(OBTENER_TIPO_PRODUCTOS);
    if (empresas.loading) {
        return 'cargando...'
    };
    if (productos.loading) {
        return 'cargando...'
    };


    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-ligth text-center">Nuevo Producto</h1>
            <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg">
                <form
                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.nombre && formik.errors.nombre ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombre}</p>
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
                                    value={formik.values.existencia}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.existencia && formik.errors.existencia ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.existencia}</p>
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
                                    value={formik.values.precio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.precio && formik.errors.precio ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.precio}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                                    Descripcion
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="descripcion"
                                    type="text"
                                    placeholder="Descripcion del producto"
                                    value={formik.values.descripcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.descripcion && formik.errors.descripcion ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.descripcion}</p>
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
                                    value={formik.values.fecha_elaboracion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.fecha_elaboracion && formik.errors.fecha_elaboracion ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.fecha_elaboracion}</p>
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
                                    value={formik.values.fecha_vencimiento}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.fecha_vencimiento}</p>
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
                                    value={formik.values.estado}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option>DISPONIBLE</option>
                                    <option>TERMINADO</option>
                                </select>
                            </div>
                            {
                                formik.touched.estado && formik.errors.estado ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.estado}</p>
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
                                    value={formik.values.empresa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                                formik.touched.empresa && formik.errors.empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.empresa}</p>
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
                                    value={formik.values.tipo_producto}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                                formik.touched.tipo_producto && formik.errors.tipo_producto ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.tipo_producto}</p>
                                    </div>
                                ) : null
                            }

                    <input
                        type="submit"
                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                        value="Agregar Nuevo Producto"
                    />
                </form>
            </div>
        </div>
        </Layout>
     );
}
 
export default NuevoProducto;