import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Router from 'next/router';

const NuevaCuenta = () => {

//validacion del formulario
const formik = useFormik({
    initialValues:{
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        repetir_contrasena: ''
    },
    validationSchema: Yup.object({
        nombre : Yup.string()
                    .required('El nombre es Obligatorio')
                    .trim('El Nombre es Obligatorio')
                    .min(3, "El nombre tiene que tener al menos 3 caracteres")
                    .max(50, "El nombre no puede superar los 20 caracteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No puede usar caracteres especiales o de tipo númerico'
                      ),
        apellido : Yup.string()
                    .required('El Apellido es Obligatorio')
                    .trim('El Apellido es Obligatorio')
                    .min(3, "El apellido tiene que tener al menos 3 caracteres")
                    .max(50, "El apellido no puede superar los 20 caracteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No puede usar caracteres especiales o de tipo númerico'
                    ),

        email : Yup.string()
        .email('El email no es valido')
        .required('El email es obligatorio'),

        contrasena : Yup.string()
        .required('El contrasena es obligatorio')
        .min(8, "El contrasena tiene que tener al menos 8 caracteres"),

        repetir_contrasena : Yup.string()
        .required('El contrasena es obligatorio')
        .min(8, "El contrasena tiene que tener al menos 8 caracteres")
        .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben ser iguales')

    }),
    onSubmit: valores => {
        console.log('enviando');
        console.log(valores);
    }
});

const Cancelar =()=>{
    Swal.fire({
        title: 'Desea Cancelar el registro?',
        text: "Volvera al inicio ",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'si',
        cancelButtonText: 'No'
    }).then(async(result) => {
        if (result.isConfirmed) {

            Router.push({
                pathname: "../"
                
            })

        }
      })
};


    return(

        <>
            <Layout>
                <h1 className="text-center text-2x1 text-blue font-light">Crear Nueva Cuenta</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                            
                            >
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apeliido

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido Usuario"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.apellido && formik.errors.apellido ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.apellido}</p>
                                    </div>
                                ) : null
                            }

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Correo

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passowrd">
                                    Contrasena

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="contrasena"
                                    type="password"
                                    placeholder="contrasena Usuario"
                                    value={formik.values.contrasena}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.contrasena && formik.errors.contrasena ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.contrasena}</p>
                                    </div>
                                ) : null
                            }

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repetir_contrasena">
                                    Repetir Contrasena

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="repetir_contrasena"
                                    type="password"
                                    placeholder="contrasena Usuario"
                                    value={formik.values.repetir_contrasena}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.repetir_contrasena && formik.errors.repetir_contrasena ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.repetir_contrasena}</p>
                                    </div>
                                ) : null
                            }

                           <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900"
                                value="Registrarse"

                            />
                            <button 
                            type="" 
                            className="bg-red-800 py-2 mt-2 px-4 w-full text-white uppercase hover:bg-gray-900"
                            onClick={()=>Cancelar()}
                            >
                                CANCELAR
                            </button>  
                            </form>

                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevaCuenta;