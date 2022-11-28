import React from 'react';
import Layout from '../componentes/Layout';
import Link  from "next/link";
const Login = () => {
    return(

        <>
            <Layout>
                <h1 className="text-center text-3x1 text-black font-light">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
                                />

                           </div>
                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nit">
                                    Nit

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="nit"
                                    type="nit"
                                    placeholder="Nit Usuario"
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
                                    placeholder="Password Usuario"
                                />

                           </div>

                           <input
                                type="submit"
                                className="bg-gray-800 py-2 px-5 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900"
                                value="INICIAR SESIÓN"

                            />
                     
                     <Link href="/nuevovendedor">
                   <a className='bg-gray-800 py-2 px-5 w-full text-center mt-1 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-6  '>
                      REGISTRARSE
                     </a>
                   </Link> 
                            </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;