import React from 'react';
import {useRouter} from 'next/router'
import Layout from '../../componentes/Layout'
import {useQuery,useMutation, gql} from '@apollo/client'
import {Formik} from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ComboTipEmpresas from '../../componentes/ComboTipEmpresas';
import Router from 'next/router';

const OBTENER_TIPO_EMPRESAS = gql`
query ObtenerTiposEmpresas {
    obtenerTiposEmpresas {
      id
      tipo_empresa
    }
  }
`;
const OBTENER_EMPRESA =gql `
query Query($obtenerEmpresaId: ID!) {
    obtenerEmpresa(id: $obtenerEmpresaId) {
      nombre_empresa
      
      direccion_empresa
      telefono
      tipo_empresa
    }
  }
`;



const ACTUALIZAR_EMPRESA=gql`
mutation ActualizarEmpresa($actualizarEmpresaId: ID!, $input: EmpresaInput) {
    actualizarEmpresa(id: $actualizarEmpresaId, input: $input) {
        nombre_empresa
        numero_sucural
        direccion_empresa

        telefono
        tipo_empresa
    }
  }
`;


const EditarEmpresa = () => {
    //obtener el id actual
    const router = useRouter ();
    const { query:{pid} } = router;

    //consultar para obtener la empresa
    const empresa = useQuery(OBTENER_EMPRESA , {
        variables:{
            obtenerEmpresaId:pid
        }
    });

    const empresas=useQuery(OBTENER_TIPO_EMPRESAS);
    
    //mutatios de actualizar
    const [actualizarEmpresa]=useMutation(ACTUALIZAR_EMPRESA);

    if(empresa.loading) return 'Cargando...';
    if (empresas.loading)  return 'cargando...';
    if(!empresa.data) return 'accion no permitida';

    const {obtenerEmpresa} = empresa.data;

    const schemaValidacion = Yup.object({
        nombre_empresa : Yup.string()
                .required('El Nombre es Obligatorio')
                .trim('El Nombre es Obligatorio')
                .min(3, "El nombre tiene que tener al menos 3 caracteres")
                .max(50, "El nombre no puede superar los 50 caracteres")
                .matches(
                    /^[aA-zZ\s]+$/,
                    'El nombre no es válido'
                  ),

        numero_sucursal : Yup.number()
                  .required('El número de Sucural es obligatorio')
                  .positive('No se aceptan números negativos o "0"')
                  .integer('La sucursal debe ser en números enteros'),

        direccion_empresa: Yup.string()
                  .required('La Dirección es Obligatoria')
                  .trim('La Dirección es Obligatoria')
                  .min(3, "La Dirección tiene que tener al menos 3 caracteres")
                  .max(150, "La Dirección no puede superar los 150 caracteres"),

        telefono : Yup.number()
                  .required('El  número de teléfono es Obligatorio')
                  .positive('No se aceptan números negativos o "0"')
                  .test('len', 'Debe tener maximo 8 digitos', val => Math.ceil (Math.log10 (val+1)) === 8),  
                                   

        tipo_empresa: Yup.string()
                        .required('El tipo de empresa es obligaorio')
                        .typeError('El tipo de empresa es obligatorio')
        
    });
    
    
    //modificar la empresa en la bd
    const actualizarInfoEmpresa = async valores =>{
        console.log(valores)
        const {nombre_empresa, numero_sucursal, direccion_empresa, telefono, tipo_empresa} = valores;
            try {
                const {data} = await actualizarEmpresa({
                    variables:{
                        actualizarEmpresaId:pid,
                        input : {
                            nombre_empresa,
                            numero_sucursal,
                            direccion_empresa,
                            telefono,
                            tipo_empresa
                        } 
                    }
                });
                console.log(data)
                Swal.fire(
                    'Actualizado!',
                    'Empresa Actualizada correctamente',
                    'success'
                  )
                router.push('/empresas');
                
            } catch (error) {
                console.log(error)
            }
    }

    const Cancelar =()=>{
        Swal.fire({
            title: 'Desea Cancelar el registro?',
            text: "Volvera a pagina empresas ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si',
            cancelButtonText: 'No'
        }).then(async(result) => {
            if (result.isConfirmed) {

                Router.push({
                    pathname: "../empresas"
                    
                })

            }
          })
    };

    return ( 
        <Layout>
        <h1 className="text-2xl text-gray-800 font-ligth">Editar Empresa</h1>
        <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg">

                <Formik
                    enableReinitialize
                    initialValues={obtenerEmpresa}
                    validationSchema={schemaValidacion }
                    onSubmit={ valores=>{
                        actualizarInfoEmpresa(valores);
                    } }
                >
                {props => {
                    return(
                        <form
                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={props.handleSubmit}
                >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre_empresa">
                                    Nombre
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre_empresa"
                                    type="text"
                                    placeholder="Nombre Empresa"
                                    value={props.values.nombre_empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.nombre_empresa && props.errors.nombre_empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombre_empresa}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero_sucursal">
                                    Numero de Sucursal
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="numero_sucursal"
                                    type="number"
                                    placeholder="Sucursal disponible"
                                    value={props.values.numero_sucursal}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.numero_sucursal && props.errors.numero_sucursal ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.numero_sucursal}</p>
                                    </div>
                                ) : null
                            }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion_empresa">
                                    Direccion de la Empresa
                                </label>
                                <input
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion_empresa"
                                    type="text"
                                    placeholder="Direccion de la empresa"
                                    value={props.values.direccion_empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.direccion_empresa && props.errors.direccion_empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.direccion_empresa}</p>
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
                                    value={props.values.telefono}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </div>
                            {
                                props.touched.telefono && props.errors.telefono ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.telefono}</p>
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
                                    value={props.values.tipo_empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    {empresas.data.obtenerTiposEmpresas.map(TipoEmpresa =>(
                                        <ComboTipEmpresas
                                            key={TipoEmpresa.id}
                                            TipoEmpresa ={TipoEmpresa }
                                        />
                                    ))}
                                </select>
                            </div>
                            {
                                props.touched.tipo_empresa && props.errors.tipo_empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.tipo_empresa}</p>
                                    </div>
                                ) : null
                            }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Editar Empresa"
                            />
                          <button 
                            type="" 
                            className="bg-red-800 py-2 mt-2 px-4 w-full text-white uppercase hover:bg-gray-900"
                            onClick={()=>Cancelar()}
                            >
                                Cancelar
                            </button>  
                </form>
                
                    );
                }}
                </Formik>
            </div>
        </div>
        </Layout>
     );
}
 
export default EditarEmpresa;