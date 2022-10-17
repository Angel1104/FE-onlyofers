import React from 'react';

const Empresa = ({empresa}) => {
    const{nombre_empresa,numero_sucursal,direccion_empresa,telefono} = empresa;
    return ( 
        <a class="flex flex-col bg-white drop-shadow hover:drop-shadow-lg hover:opacity-70 rounded-md">
                <img src='https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/11/hfpqyV7B-IMG-Dubai-UAE.jpg'
                    class="h-36 object-cover rounded-tl-md rounded-tr-md"/>
                <div class="px-3 py-2">
                    <h1 class="font-semibold">{nombre_empresa}</h1>
                    <p className='font-semibold'>Sucursal: </p>
                    <p className='text-sm'>{numero_sucursal}</p>
                    <p class="text-sm">Precio: {direccion_empresa} $</p>
                    <p class="text-sm">Telefono: {telefono}</p>
                </div>
        </a>
    )
}
 
export default Empresa;