import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Router, { useRouter } from 'next/router';
import {useMutation,gql, useQuery} from '@apollo/client';



const NUEVO_VENDEDOR=gql`
mutation Mutation($input: VendedorInput) {
    nuevoVendedor(input: $input) {
      nombre_vendedor
      NIT
      apellido_vendedor
      contrasenia_vendedor
      correo_vendedor
    }
  }
`;


const NuevoVendedor = () => {

    //routing
    const router = useRouter();


    //mutation para crear producto
    const  [nuevoVendedor]= useMutation(NUEVO_VENDEDOR);


//validacion del formulario
const formik = useFormik({
    initialValues:{
        nombre_vendedor: '',
        apellido_vendedor: '',
        correo_vendedor: '',
        contrasenia_vendedor: '',
        repetir_contrasena: '',
        NIT: ''
    },
    validationSchema: Yup.object({
        nombre_vendedor : Yup.string()
                    .required('El nombre es Obligatorio')
                    .trim('El Nombre es Obligatorio')
                    .min(3, "El nombre tiene que tener al menos 3 caracteres")
                    .max(20, "El nombre no puede superar los 20 caracteres")
                    .matches(
                        /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]+/,
                        'No puede usar caracteres especiales o de tipo númerico'
                      ),
        apellido_vendedor : Yup.string()
                    .required('El Apellido es Obligatorio')
                    .trim('El Apellido es Obligatorio')
                    .min(3, "El apellido tiene que tener al menos 3 caracteres")
                    .max(20, "El apellido no puede superar los 20 caracteres")
                    .matches(
                        /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]+/,
                        'No puede usar caracteres especiales o de tipo númerico'
                    ),

        correo_vendedor : Yup.string()
            .email('El correo no es valido')
            .required('El correo es obligatorio'),

        contrasenia_vendedor : Yup.string()
            .required('La contraseña es obligatoria')
            .min(8, "La contraseña tiene que tener al menos 8 caracteres"),

        repetir_contrasena : Yup.string()
             .required('La contraseña es obligatoria')
             .min(8, "La contraseña tiene que tener al menos 8 caracteres")
             .oneOf([Yup.ref('contrasenia_vendedor'), null], 'Las contraseñas deben ser iguales'),

        NIT : Yup.number()
            .required('El  NIT es Obligatorio')
            .moreThan(-1, 'No se aceptan números negativos')
            .integer('El NIT debe ser un número entero')
            .test('len', 'El NIT debe tener 14 digitos', val => Math.ceil (Math.log10 (val+1)) === 14), 
    }),
    onSubmit: async valores => {
        const {NIT, apellido_vendedor, contrasenia_vendedor, correo_vendedor,nombre_vendedor } = valores;
        NIT=NIT.toString();
        try {
            const {data} = await nuevoVendedor({
                variables:{
                    input : {
                        nombre_vendedor,
                        apellido_vendedor,
                        contrasenia_vendedor,
                        correo_vendedor,
                        NIT,
                    } 
                }
            });
            //vendedor creado correctamente mostrar mensaje
            console.log(data)
            Swal.fire(
                'Creado',
                'Creado correctamente',
                'success'
            )
            router.push('/iniciarsesionve');
            
        } catch (error) {
            console.log(error)
        }
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
                pathname: "/iniciarsesionve"
                
            })

        }
      })
};


    return(

        <>
            <Layout>
                <h1 className="text-center text-2x1 text-blue font-light">Nuevo Vendedor</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
                        <form
                            onSubmit={formik.handleSubmit}
                            >
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_vendedor">
                                    Nombre

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="nombre_vendedor"
                                    type="text"
                                    placeholder="Nombre Vendedor"
                                    value={formik.values.nombre_vendedor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.nombre_vendedor && formik.errors.nombre_vendedor ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombre_vendedor}</p>
                                    </div>
                                ) : null
                            }


                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido_vendedor">
                                    Apellido

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="apellido_vendedor"
                                    type="text"
                                    placeholder="Apellido Vendedor"
                                    value={formik.values.apellido_vendedor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.apellido_vendedor && formik.errors.apellido_vendedor ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.apellido_vendedor}</p>
                                    </div>
                                ) : null
                            }

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo_vendedor">
                                    Correo

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="correo_vendedor"
                                    type="email"
                                    placeholder="Correo Vendedor"
                                    value={formik.values.correo_vendedor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.correo_vendedor && formik.errors.correo_vendedor ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.correo_vendedor}</p>
                                    </div>
                                ) : null
                            }

                           

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contrasenia_vendedor">
                                    Contraseña

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="contrasenia_vendedor"
                                    type="password"
                                    placeholder="Contraseña Vendedor"
                                    value={formik.values.contrasenia_vendedor}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                           </div>

                           {
                                formik.touched.contrasenia_vendedor && formik.errors.contrasenia_vendedor ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.contrasenia_vendedor}</p>
                                    </div>
                                ) : null
                            }

                           <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repetir_contrasena">
                                    Repetir Contraseña

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="repetir_contrasena"
                                    type="password"
                                    placeholder="Contraseña Vendedor"
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

                  <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="NIT">
                                    NIT
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="NIT"
                                    type="number" 
                                    placeholder="NIT"
                                    value={formik.values.NIT}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {
                                formik.touched.NIT && formik.errors.NIT ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.NIT}</p>
                                    </div>
                                ) : null
                            }

                  <button 
                    type="submit" 
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                    //onClick={()=>confirmarRegistrarse  ()}
                    >
                    REGISTRARSE
                    
                  </button>
                
                     
                    </form>
                    <button 
                            type="submit" 
                            className="bg-red-800 py-2 mt-2 px-4 w-full text-white uppercase hover:bg-gray-900"
                            onClick={()=>Cancelar()}
                         >
                          CANCELAR    
                    </button>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevoVendedor;