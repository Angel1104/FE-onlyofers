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

const IniciarSesionVE = () => {
    //routing
    const router = useRouter();


    
//form para new vendedor
    const formik = useFormik({
        initialValues:{
            correo : '',
            NIT: '',
            Contraseña: '',
            
        },
        validationSchema: Yup.object({
            email : Yup.string()
                      .required('El correo es Obligatorio')
                      .email('El correo no es valido'),
            nit : Yup.number()
                      .required('El  NIT es Obligatorio')
                      .moreThan(-1, 'No se aceptan números negativos')
                      .integer('El NIT debe ser un número entero')
                      
                      
                      .test('len', 'El NIT debe tener 7 digitos', val => Math.ceil (Math.log10 (val+1)) === 7),             
            password : Yup.string()
                      .required('La Contraseña es Obligatoria')
                      .min(8, 'La contraseña tiene que tener al menos 8 caracteres')
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
                                Bienvenido vendedor que tengas un buen día!
                            </a>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Correo
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Correo del Usuario"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    
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
                                    NIT
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nit"
                                    type="number"
                                    placeholder="NIT Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Contraseña 
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña Usuario"
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
                            className="bg-gray-800 text-center mx-40 mb-5 mt-5 p-2 text-white uppercase hover:bg-gray-900"
                            value="Iniciar Sesion"
                        /> 
                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿Eres un cliente?
                            <Link href="/login">
                            <a className='bg-gray-800 px-2 mx-12 mb-3 inline-block text-white hover:bg-gray-900  '>
                            Inicia Sesión
                            </a>
                            </Link> 
                            </h1>

                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿No tiene una cuenta?
                            <Link href="/nuevovendedor">
                            <a className='bg-gray-800 px-2 mx-3 inline-block text-white hover:bg-gray-900 '>
                            Registrarse  
                            </a>
                            </Link> 
                            </h1>
                </form>
                
                </div>
            </div>
        </div>
        </Layout>
     );
}
 {};
export default IniciarSesionVE;