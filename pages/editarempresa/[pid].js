import React from 'react';
import {useRouter} from 'next/router'
import Layout from '../../componentes/Layout'
import {useQuery,useMutation, gql} from '@apollo/client'
import {Formik} from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ComboEmpresas from '../../componentes/ComboEmpresas';
import ComboProductos from '../../componentes/ComboProductos';

const OBTENER_TIPO_EMPRESA = gql`
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
      id
      nombre_empresa
      numero_sucursal
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
      numero_sucursal
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
    const id = pid;
    //consultar para obtener el producto
    const empresa = useQuery(OBTENER_EMPRESA , {
        variables:{
            obtenerEmpresaId:id
        }
    });
    const empresas =useQuery(OBTENER_TIPO_EMPRESA);
    
    const [actualizarEmpresa]=useMutation(ACTUALIZAR_EMPRESA);

    const schemaValidacion = Yup.object({
        nombre_empresa : Yup.string()
                    .required('El Nombre es Obligatorio'),
        sucursal : Yup.number()
                    .required('La sucursal es Obligatorio')
                    .positive('No se aceptan numeros negativos')
                    .integer('la sucursal debe ser en numeros enteros'),
        direccion: Yup.string()
                    .required('La direccion es obligatoria'),
        telefono : Yup.number()
                .required('El  telefono es Obligatorio')
                .positive('No se aceptan numeros negativos'),
        tipo_empresa: Yup.string()
                        .required('El tipo es obligaorio')
        
    });
    if(empresa.loading) return 'Cargando....';
    if (empresas.loading) {
        return 'cargando...'
    };
    if (empresas.loading) {
        return 'cargando...'
    };

    const {obtenerEmpresa} = empresa.data;

    //modificar la empresa en la bd
    const actualizarInfoEmpresa = async valores =>{
        const {id,nombre_empresa, numero_sucursal, direccion_empresa, telefono, tipo_empresa} = valores;
            try {
                const {data} = await actualizarEmpresa({
                    variables:{
                        actualizarEmpresaId:id,
                        input : {
                            nombre_empresa,
                            numero_sucursal,
                            direccion_empresa,
                            telefono,
                            tipo_empresa
                        } 
                    }
                });
                
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
    return ( 
        <Layout>
        <h1 className="text-2xl text-gray-800 font-ligth">Ediitar Empresa</h1>
        <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg">

                <Formik
                    validationSchema={schemaValidacion }
                    enableReinitialize
                    initialValues={obtenerEmpresa}
                    onSubmit={(valores)=>{
                        actualizarInfoEmpresa(valores);
                    }}
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
                                    Sucursal disponible
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
                                    Direccion
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
                                    Telefono
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
                                    Tipo de empresa
                                </label>
                                <select
                                    className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="tipo_empresa"
                                    value={props.values.tipo_empresa}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    {empresas.data.obtenerTiposEmpresas.map(TipoEmpresa =>(
                                        <ComboEmpresas
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