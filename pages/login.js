import React from 'react';
import Layout from '../componentes/Layout';
import Swal from 'sweetalert2';
import Router from 'next/router';
import Link  from "next/link";

const Login = () => {

    

    return(

        <>
            <Layout>
                

                <div className="flex justify-center mt-5">
                <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">

                        <form>
                            <h1 className="text-3xl text-gray-800 font-ligth text-center mt-12">Iniciar Sesión</h1>
                            <a className='text-black block text-gray-800 font-ligth text-center mb-3'>
                                Bienvenido vendedor que tengas un buen día!
                            </a>
                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Correo

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Correo Usuario"
                                />

                           </div>

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passowrd">
                                    Contraseña

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña Usuario"
                                />

                           </div>

                           <input
                                type="submit"
                                className="bg-gray-800 text-center mx-40 mb-5 mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="INICIAR SESIÓN"

                            />
                            
                            
                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿Eres un vendedor?
                            <Link href="/iniciarsesionve">
                            <a className='bg-gray-800 px-2 mx-12 mb-3 inline-block text-white hover:bg-gray-900  '>
                            Inicia Sesión
                            </a>
                            </Link> 
                            </h1>

                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿No tiene una cuenta?
                            <Link href="/nuevacuenta">
                            <a className='bg-gray-800 px-2 mx-3 inline-block text-white hover:bg-gray-900 '>
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