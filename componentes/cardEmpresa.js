import React from 'react';

const Empresa = ({empresa}) => {
    const{nombre_empresa,numero_sucursal,direccion_empresa,telefono,tipo_empresa,id} = empresa;
    return ( 
        <a class="flex flex-col bg-white drop-shadow hover:drop-shadow-lg hover:opacity-70">
                <img src='https://www.timeoutdubai.com/cloud/timeoutdubai/2022/10/26/Belcanto-Dubai-1-1000x750.jpg'
                    class="h-36 object-cover "/>
                <div class="px-1.9 py-2">
                    <h1 class="font-semibold">{nombre_empresa}</h1>
                    <p className='text-sm'> Sucursales: {numero_sucursal} </p>
                    <p className='text-sm'>Dirección: {direccion_empresa}</p>
                    <p class="text-sm">Teléfono: {telefono} </p>
                    <p class="text-sm">Tipo: {tipo_empresa}</p>
                </div>
        </a>
    )
}
export default Empresa;