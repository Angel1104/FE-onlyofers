import React from 'react';
import Layout from '../componentes/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Router, { useRouter } from 'next/router';
import {useMutation,gql, useQuery} from '@apollo/client';



const vendedors=gql`
mutation NuevoVendedor($input: VendedorInput) {
    nuevoVendedor(input: $input) {
      NIT
      apellido_vendedor
      contrasenia_vendedor
      correo_vendedor
      nombre_vendedor
    }
  }
`;
const obtener_vendedors = gql`
query ObtenerVendedor($correoVendedor: String!) {
    obtenerVendedor(correo_vendedor: $correoVendedor) {
      NIT
      apellido_vendedor
      contrasenia_vendedor
      correo_vendedor
      nombre_vendedor
    }
  }
`;

const NuevoVendedor = () => {

    const router = useRouter();


    //mutation para crear producto
    const  [NuevoVendedor]= useMutation(vendedors
        , {
        update(cache, { data:{nuevoVendedor}}){
            // obtener el objeto de cache que deseamos actualizar
            const { obtenerVendedor} = cache.readQuery({ query: obtener_vendedors});

            // reeescriibr el cache( el cache nunca se debe modificar se reescribe)
            cache.writeQuery({
                query: obtener_vendedors,
                data:{
                    obtenerVendedor : [...obtenerVendedor , nuevoVendedor]
                }
            })
        }
    }
    );

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
                    .max(50, "El nombre no puede superar los 20 caracteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No puede usar caracteres especiales o de tipo númerico'
                      ),
        apellido_vendedor : Yup.string()
                    .required('El Apellido es Obligatorio')
                    .trim('El Apellido es Obligatorio')
                    .min(3, "El apellido tiene que tener al menos 3 caracteres")
                    .max(50, "El apellido no puede superar los 20 caracteres")
                    .matches(
                        /^[aA-zZ\s]+$/,
                        'No puede usar caracteres especiales o de tipo númerico'
                    ),

        correo_vendedor : Yup.string()
        .email('El email no es valido')
        .required('El email es obligatorio'),

        contrasenia_vendedor : Yup.string()
        .required('El contrasena es obligatorio')
        .min(8, "El contrasena tiene que tener al menos 8 caracteres"),

        repetir_contrasena : Yup.string()
        .required('El contrasena es obligatorio')
        .min(8, "El contrasena tiene que tener al menos 8 caracteres")
        .oneOf([Yup.ref('contrasenia_vendedor'), null], 'Las contraseñas deben ser iguales'),

        NIT : Yup.number()
                        .required('La cantidad existente es Obligatorio')
                        .positive('No se aceptan numeros negativos o "0"')
                        .integer('la existencia debe ser en numeros enteros')
                        .test('len', 'Debe tener 14 digitos', val => Math.ceil (Math.log10 (val+1)) === 14),   
    }),
    onSubmit: valores => {
        console.log('enviando');
        console.log(valores);
    },

    onSubmit: async valores => {
        const {NIT, apellido_vendedor, contrasenia_vendedor, correo_vendedor,nombre_vendedor } = valores;
        try {
            const {data} = await NuevoVendedor({
                variables:{
                    input : {
                        nombre_vendedor: nombre_vendedor,
                        apellido_vendedor: apellido_vendedor,
                        contrasenia_vendedor: contrasenia_vendedor,
                        correo_vendedor: correo_vendedor,
                        NIT: NIT,
                    } 
                }
            });
            //producto creado correctamente mostrar mensaje
            console.log(data)
            Swal.fire(
                'Creado',
                'Creado correctamente',
                'success'
            )
            router.push('/productos');
            
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
                                    Apeliido

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
                                    placeholder="Email Vendedor"
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
                                    Contrasena

                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                    id="contrasenia_vendedor"
                                    type="password"
                                    placeholder="contrasenia Vendedor"
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

<div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="NIT">
                                    Nit
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
                                formik.touched.Nit && formik.errors.Nit ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.Nit}</p>
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
                                Cancelar
                            </button>  
                            </form>

                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevoVendedor;