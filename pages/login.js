import React from 'react';
import Layout from '../componentes/Layout';
import Swal from 'sweetalert2';
import Router from 'next/router';
import Link  from "next/link";
import {useFormik} from 'formik';
import * as Yup from 'yup';

const Login = () => {

    const formik = useFormik( {
        initialValues:{
        email:'',
        password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
            .email('El email no es valido')
            .required('El email es obligatorio'),
            password: Yup.string()
            .required('El password es obligatorio'),

        }),
        onSubmit: valores => {
            console.log(valores);
        }
    })

    return(

        <>
            <Layout>
                <h1 className="text-center text-2x1 text-blue font-light">INICIAR SESION</h1>

                <div className="flex justify-center mt-5">
                <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">

                        <form>

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Correo

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Correo Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Contraseña

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
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
                                value="INICIAR SESION"

                            />
                            
                            
                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿Eres un vendedor?
                            <Link href="/iniciarsesionve">
                            <a className='bg-gray-800 px-2 mx-8 mb-3 inline-block text-white hover:bg-gray-900  '>
                            Inicia Sesión
                            </a>
                            </Link> 
                            </h1>

                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿No tiene una cuenta?
                            <Link href="/nuevacuenta">
                            <a className='bg-gray-800 px-3 mx-3 inline-block text-white hover:bg-gray-900 '>
                            Registrarse
                            </a>
                            </Link> 
                            </h1>
                            </form>

                    </div>
                </div>
            </Layout>
        </>
            );
        }
        
        export default Login;