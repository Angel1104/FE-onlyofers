
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
mutation Mutation($input: EmpresaInput) {
    nuevaEmpresa(input: $input) {
        nombre_empresa
        numero_sucursal
        direccion_empresa
        telefono
        tipo_empresa
    }
  }  
`;

const OBTENER_EMPRESAS= gql`
query Query {
    obtenerEmpresas {
      direccion_empresa
      id
      nombre_empresa
      numero_sucursal
      telefono
      tipo_empresa
    }
  }
`;

const OBTENER_TIPO_EMPRESAS = gql`
query ObtenerTiposEmpresas {
    obtenerTiposEmpresas {
      tipo_empresa
      id
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
    const Cancelar =()=>{
        Swal.fire({

            title: '¿Desea Cancelar el registro?',
            text: "Volvera a página empresas ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
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
                    .required('El nombre es Obligatorio')
                    .trim('El Nombre es Obligatorio')
                    .min(3, "El nombre tiene que tener al menos 3 caracteres")
                    .max(50, "El nombre no puede superar los 50 caracteres")
                    .matches(
                        /^[aA-zZ1234567890\s]+$/,
                        'No puede usar caracteres especiales o de tipo númerico'
                      ),

            sucursal : Yup.number()
                      .required('El número de Sucursal es Obligatorio')
                     .moreThan(-1, 'No se aceptan números negativos')
                      .integer('El número de Sucursal debe ser en números enteros'),

            direccion: Yup.string()
                      .required('La Dirección es Obligatoria') 
                      .trim('La Dirección es Obligatoria')
                      .min(3, "La Dirección tiene que tener al menos 3 caracteres")
                      .max(150, "La Dirección no puede superar los 150 caracteres"),
                     
            telefono : Yup.number()
                      .required('El  Teléfono es Obligatorio')
                      .positive('No se aceptan números negativos')
                      .test('len', 'El número de teléfono debe tener 7 caracteres', val => Math.ceil (Math.log10 (val+1)) === 7),             

            tipo_empresa: Yup.string()
                            .required('El tipo de empresa es obligaorio')
        }),
        onSubmit: async valores => {
            const {nombre, sucursal, direccion, telefono, tipo_empresa} = valores;
            try {
                Swal.fire({

                    title: '¿Desea Agregar esta Empresa?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Agregar',
                    cancelButtonText: 'No, Cancelar'
                }).then(async(result) => {
                    if (result.isConfirmed) {
        
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
        
                    }
                })
                
                
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
                <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <p className='block text-gray-600 text-sm mb-2' > Aumentar la letra S + número de Sucursal al final del nombre </p>
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
                                    Dirección
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
                    >
                    
                    AGREGAR NUEVA EMPRESA
                    
                </button>
                </form>
                <button 
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
export default NuevaEmpresa;