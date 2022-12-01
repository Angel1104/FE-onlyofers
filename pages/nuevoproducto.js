import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation,gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2'
import ComboEmpresas from '../componentes/ComboEmpresas';
import ComboProductos from '../componentes/ComboProductos';
import Router from 'next/router';



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
      fecha_vencimiento
      estado
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
    const  [nuevoProducto]= useMutation(NUEVO_PRODUCTO
        , {
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
    }
    );

    const confirmarAgregarProducto =()=>{
        Swal.fire({
            title: 'Desea Agregar este producto?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Agregar',
            cancelButtonText: 'No, Cancelar',
          })
    };

    const Cancelar =()=>{
        Swal.fire({
            title: 'Desea Cancelar el registro?',
            text: "Volvera a página productos ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(async(result) => {
            if (result.isConfirmed) {

                Router.push({
                    pathname: "/productos"
                    
                })

            }
          })
    };

    const fecha = () => {
        var fechaHoy
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        if(month < 10){
            fechaHoy =(`0${month}-${day}-${year}`)
        }else{
            fechaHoy =(`${month}-${day}-${year}`)
        }
        console.log(fechaHoy)
        
        return ( fechaHoy );
    }


    
//form para new product
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
                    .required('El Nombre es Obligatorio')
                    .trim('El Nombre es Obligatorio')
                    .min(3, "El nombre tiene que tener al menos 3 carácteres")
                    .max(50, "El nombre no puede superar los 50 carácteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No se admite caracteres de tipo numérico'
                      ),
            existencia : Yup.number()
                        .required('La cantidad existente es Obligatorio')
                        .positive('No se aceptan numeros negativos o "0"')
                        .integer('la existencia debe ser en numeros enteros'),
            precio : Yup.number()
                        .required('El  precio es Obligatorio')
                        .positive('No se aceptan numeros negativos o "0"')
                        .max(10000, 'No se admite insertar montos de dinero imposible'),
            descripcion: Yup.string()
                        .required('La descripción es obligatoria')
                        .trim('La descripción es obligatoria')
                        .min(3, "La descripción tiene que tener al menos 3 caracteres")
                        .max(150, "La descripción no puede superar los 150 caracteres"),
            fecha_elaboracion: Yup.date()
                            .required('La fecha de elaboración es obligatoria')
                            .max('11-11-2022', 'La fecha de elaboración no debe ser antes de la fecha actual')
                            .min('11-11-2018', 'La fecha de elaboración no puede ser menos a los cuatro años'),
            fecha_vencimiento: Yup.date()
                            .required('La fecha de vencimiento es obligatoria')
                            .min(
                                Yup.ref("fecha_elaboracion"),
                                "La fecha de vencimiento debe ser despúes de la fecha de elaboración"
                            )
                            .max('11-11-2028', 'La fecha de vencimiento no debe ser mayor a los cuatro años'),
            estado: Yup.string()
                    .required('Estado obligatorio'),
            empresa: Yup.string()
                    .required('La empresa es obligatoria'),
            tipo_producto: Yup.string()
                    .required('El tipo de producto es obligatorio')
                    

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
                console.log(data)
                Swal.fire(
                    'Creado',
                    'Creado correctamente',
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
                <div  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <form
                   
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
                                    Descripción
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="descripcion"
                                    type="text"
                                    placeholder="Descripción del producto"
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
                                    Fecha de Elaboración
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
                                    Estado del Producto
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
                                    <option selected>Seleccione</option>
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
                                    Tipo de Producto 
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="tipo_producto"
                                    value={formik.values.tipo_producto}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option selected>Seleccione</option>
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

                <button 
                    type="submit" 
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                    onClick={()=>confirmarAgregarProducto()}
                    >
                    
                    AGREGAR NUEVO PRODUCTO
                    
                </button>
                </form>
                <button 
                    type="" 
                    className="bg-red-800 py-2 mt-2 px-4 w-full text-white uppercase hover:bg-gray-900"
                    onClick={()=>Cancelar()}
                    >
                    Cancelar    
                </button>
                </div>
            </div>
        </div>
        </Layout>
     );
}
 {};
export default NuevoProducto;