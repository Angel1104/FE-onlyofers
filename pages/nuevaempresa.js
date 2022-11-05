import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation,gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2'
import ComboTipEmpresas from '../componentes/ComboTipEmpresas';
import Router from 'next/router';



const NUEVA_EMPRESA=gql`
mutation nuevaEmpresa($input: EmpresaInput){
    nuevaEmpresa (input : $input){
        id
        nombre_empresa
        numero_sucursal
        direccion_empresa
        telefono
        tipo_empresa
    }
  }
`;

const OBTENER_EMPRESAS= gql`
query ObtenerEmpresas {
    obtenerEmpresas {
      nombre_empresa
      numero_sucursal
      direccion_empresa
      telefono
    }
  }
`;

const OBTENER_TIPO_EMPRESAS = gql`
query ObtenerTiposEmpresas {
    obtenerTiposEmpresas {
      id
      tipo_empresa
    }
  }
`;

const NuevaEmpresa = () => {
    //routing
    const router = useRouter();


    //mutation para crear empresa
    const  [nuevaEmpresa]= useMutation(NUEVA_EMPRESA
        , {
        update(cache, { data:{nuevaEmpresa}}){
            // obtener el objeto de cache que deseamos actualizar
            const { obtenerEmpresas} = cache.readQuery({ query: OBTENER_EMPRESAS});

            // reeescriibr el cache( el cache nunca se debe modificar se reescribe)
            cache.writeQuery({
                query: OBTENER_EMPRESAS,
                data:{
                    obtenerEmpresas : [...obtenerEmpresas , nuevaEmpresa]
                }
            })
        }
    }
    );

    const confirmarAgregarEmpresa =()=>{
        Swal.fire({
            title: 'Desea Agregar esta Empresa?',
            
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Agregar',
            cancelButtonText: 'No, Cancelar'
          })
    };

    const Cancelar =()=>{
        Swal.fire({
            title: 'Desea Cancelar el registro?',
            text: "Volvera a pagina empresas ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si',
            cancelButtonText: 'No'
        }).then(async(result) => {
            if (result.isConfirmed) {

                Router.push({
                    pathname: "/empresas"
                    
                })

            }
          })
    };

    
//form para new empresa
    const formik = useFormik({
        initialValues:{
            nombre : '',
            sucursal: '',
            direccion: '',
            telefono:'',
            tipo_empresa: ''
        },
        validationSchema: Yup.object({
            nombre : Yup.string()
                    .required('El Nombre es Obligatorio')
                    .min(3, "El nombre tiene que tener al menos 3 carácteres")
                    .max(50, "El nombre no puede superar los 50 carácteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No puede usar caracteres especiales'
                      ),

            sucursal : Yup.number()
                      .required('El numero de Sucursal es Obligatorio')
                      .positive('No se aceptan numeros negativos o "0"')
                      .integer('El numero de Sucursal debe ser en numeros enteros'),

            direccion: Yup.string()
                      .required('La direccion es obligatoria')
                      .min(3, "La direccion tiene que tener al menos 3 carácteres")
                      .max(150, "La direccion no puede superar los 150 carácteres"),

            telefono : Yup.number()
                      .required('El  Telefono es Obligatorio')
                      .positive('No se aceptan numeros negativos o "0"')
                      .max(8)
                      .min(7), 

            tipo_empresa: Yup.string()
                            .required('Se debe seleccionar el tipo de empresa')
        }),
        onSubmit: async valores => {
            const {nombre, sucursal, direccion, telefono, tipo_empresa} = valores;
            try {
                const {data} = await nuevaEmpresa({
                    variables:{
                        input : {
                            nombre_empresa: nombre,
                            numero_sucursal: sucursal,
                            direccion_empresa: direccion,
                            telefono: telefono,
                            tipo_empresa: tipo_empresa
                        } 
                    }
                });
                //empresa creada correctamente mostrar mensaje
                console.log(data)
                Swal.fire(
                    'Creado',
                    'Creado correctamente',
                    'success'
                )
                router.push('/empresas');
                
            } catch (error) {
                console.log(error)
            }
        }
    });
    // obtener empresas de graphql
    const empresas=useQuery(OBTENER_TIPO_EMPRESAS);
    if (empresas.loading) {
        return 'cargando...'
    };
    

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-ligth text-center">Nueva Empresa</h1>
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
                                    placeholder="Nombre Empresa"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sucursal">
                                    Número de Sucursal 
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="sucursal"
                                    type="number"
                                    placeholder="Número de Sucursal"
                                    value={formik.values.sucursal}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.sucursal && formik.errors.sucursal ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.sucursal}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                    Teléfono
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="telefono"
                                    type="number"
                                    placeholder="Telefono"
                                    value={formik.values.telefono}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.telefono && formik.errors.telefono ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.telefono}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                    Direccion
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion"
                                    type="text"
                                    placeholder="Dirección de la Empresa"
                                    value={formik.values.direccion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.direccion && formik.errors.direccion ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.direccion}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo_empresa">
                                    Tipo de Empresa
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="tipo_empresa"
                                    value={formik.values.tipo_empresa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option selected>selecione un tipo de empresa</option>
                                    {empresas.data.obtenerTiposEmpresas.map(TipoEmpresa =>(
                                        <ComboTipEmpresas
                                            key={TipoEmpresa.id}
                                            TipoEmpresa ={TipoEmpresa }
                                        />
                                    ))}
                                </select>
                            </div>
                            {
                                formik.touched.tipo_empresa && formik.errors.tipo_empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.tipo_empresa}</p>
                                    </div>
                                ) : null
                            }

                <button 
                    type="submit" 
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                    onClick={()=>confirmarAgregarEmpresa()}
                    >
                    
                    AGREGAR NUEVA EMPRESA
                    
                </button>
                
                <button 
                    type="submit" 
                    className="bg-red-800 py-2 mt-2 px-4 w-full text-white uppercase hover:bg-gray-900"
                    onClick={()=>Cancelar()}
                    >
                    Cancelar    
                </button>
                </form>
            </div>
        </div>
        </Layout>
     );
}
 {};
export default NuevaEmpresa;