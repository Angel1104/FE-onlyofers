import React,{useState} from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation,gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2'
import Router from 'next/router';
import Link from 'next/link'

const OBTENER_CLIENTE=gql`
query Query($correoCliente: String!) {
    obtenerCliente(correo_cliente: $correoCliente) {
      apellido_cliente
      contrasenia_cliente
      correo_cliente
      id
      nombre_cliente
    }
  }
`;

const AUTENTICAR_CLIENTE=gql`
mutation AutenticarCliente($input: AutenticarCInput) {
    autenticarCliente(input: $input) {
      token
    }
  }
`;

const Login = () => {

    const[mensaje, guardarMensaje]= useState(null)
    //routing
    const router = useRouter();
    const [autenticarCliente] = useMutation(AUTENTICAR_CLIENTE);

    const formik = useFormik( {
        initialValues:{
        email:'',
        password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
            .email('El correo no es valido')
            .required('El correo es obligatorio'),
            password: Yup.string()
            .required('La contraseña es obligatoria'),

        }),
        onSubmit: async valores => {
            const{email,password}=valores;
            try {
                const {data} = await autenticarCliente ({
                    variables:{
                        input:{
                            contrasenia_cliente: password,
                            correo_cliente: email
                        }
                    }
                });
            console.log(data)
            guardarMensaje("Autenticando...");

            //guardar el toekn en localstorage
            const {token} = data.autenticarCliente;
            localStorage.setItem('token', token)

            
            setTimeout(() => {
                guardarMensaje(null);
                Swal.fire(
                    'Sesion Iniciada',
                    'La sesion se inicio correctamente',
                    'success'
                )
                router.push('/')
            }, 2000);
            } catch (error) {
                guardarMensaje(error.message)
                //console.log(error)
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        }
    })

    const mostrarMensaje =()=>{
        return(
            <div 
            className='bg-red-500 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'
            >
                <p>{mensaje}</p>
            </div>
        )
    }
    return(

        <>
            <Layout>

                <div className="flex justify-center mt-5">
                <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <h1 className="text-center text-2x1 text-blue font-light">INICIAR SESION</h1>
                

                        <form
                        onSubmit={formik.handleSubmit}
                        >

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
                            </form>
                            
                            {/* <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿Eres un vendedor?
                            <Link href="/iniciarsesionve">
                            <a className='bg-gray-800 px-2 mx-8 mb-3 inline-block text-white hover:bg-gray-900  '>
                            Inicia Sesión
                            </a>
                            </Link> 
                            </h1> */}

                            <h1 className="text-black block mx-16 text-gray-800 font-ligth ">¿No tiene una cuenta?
                            <Link href="/nuevacuenta">
                            <a className='bg-gray-800 px-3 mx-3 inline-block text-white hover:bg-gray-900 '>
                            Registrarse
                            </a>
                            </Link> 
                            </h1>
                            {mensaje && mostrarMensaje()}

                    </div>
                </div>
            </Layout>
        </>
            );
        }
        
        export default Login;