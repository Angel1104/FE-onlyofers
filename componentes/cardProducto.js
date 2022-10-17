import React from 'react';

const Producto = ({producto}) => {
    const{nombre_producto,descripcion_producto,precio,existencia} = producto;
    return ( 
        <a class="flex flex-col bg-white drop-shadow hover:drop-shadow-lg hover:opacity-70 rounded-md">
                <img src='https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/11/hfpqyV7B-IMG-Dubai-UAE.jpg'
                    class="h-36 object-cover rounded-tl-md rounded-tr-md"/>
                <div class="px-3 py-2">
                    <h1 class="font-semibold">{nombre_producto}</h1>
                    <p className='font-semibold'>Descripcion: </p>
                    <p className='text-sm'>{descripcion_producto}</p>
                    <p class="text-sm">Precio: {precio} $</p>
                    <p class="text-sm">Stock disponible: {existencia}</p>
                </div>
        </a>
    )
}
 
export default Producto;