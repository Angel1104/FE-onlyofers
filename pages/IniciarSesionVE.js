import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation,gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2'
import Router from 'next/router';
import Link from 'next/link'

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input : AutenticarInput){
        autenticarUsuario(input:$input){
        token
        }
    }
`;
const OBTENER_VENDEDOR = gql  `
query ObtenerVendedor($correoVendedor: String!) {
    obtenerVendedor(correo_vendedor: $correoVendedor) {
      contrasenia_vendedor
      correo_vendedor
      NIT
      apellido_vendedor
      nombre_vendedor
        }
    }
`;
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

const IniciarSesionVE = () => {
    //routing
    const router = useRouter();


   
    

    
//form para new empresa
    const formik = useFormik({
        initialValues:{
            email : '',
            nit: '',
            password: '',
            
        },
        validationSchema: Yup.object({
            email : Yup.string()
                      .required('El Email es Obligatorio')
                      .email('El Email no es valido'),
            nit : Yup.number()
                      .required('El  NIT es Obligatorio')
                      .positive('No se aceptan números negativos')
                      .test('len', 'El número de teléfono solo tiene 7 caracteres', val => Math.ceil (Math.log10 (val+1)) === 7),             
            password : Yup.string()
                      .required('El Password no puede estar vacio')
                      .min(6, 'Debe tener minimo 6 caracteres')
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
    
    

    return ( 
        <Layout>
            <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg">
                <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <form
                
                    onSubmit={formik.handleSubmit}
                >
                            <h1 className="text-3xl text-gray-800 font-ligth text-center mt-12">Iniciar Sesión</h1>
                            <a className='text-black block text-gray-800 font-ligth text-center mb-3'>
                                Bienvenido vendedor que tengas un buen dia!
                            </a>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
                                    
                                />
                            </div>
                            {
                                formik.touched.email && formik.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.email}</p>
                                    </div>
                                ) : null
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nit">
                                    Nit
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nit"
                                    type="nit"
                                    placeholder="Nit Usuario"
                                    value={formik.values.nit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.nit && formik.errors.nit ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nit}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sucursal">
                                Password 
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password Usuario"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.password && formik.errors.password ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.password}</p>
                                    </div>
                                ) : null
                            }
                            <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                            value="Iniciar Sesion"
                        />
                            <div className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 text-center">
                            <Link href="/nuevovendedor">
                                <a className=" text-white uppercase ">
                                    Registrarse Vendedor
                                </a>
                            </Link>
                        </div>
                        <div className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 text-center">
                            <Link href="/nuevacuenta">
                                <a className=" text-white uppercase ">
                                    Registrarse 
                                </a>
                            </Link>
                        </div>  
                
                
                </form>
                
                </div>
            </div>
        </div>
        </Layout>
     );
}
 {};
export default IniciarSesionVE;