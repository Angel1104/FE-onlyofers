import React from 'react';

const Empresa = ({empresa}) => {
    const{nombre_empresa,numero_sucursal,direccion_empresa,telefono,tipo_empresa} = empresa;
    return ( 
        <a class="flex flex-col bg-white drop-shadow hover:drop-shadow-lg hover:opacity-70 ">
                <img src='https://imgs.search.brave.com/AYF8Fd_I5vgyPjpZcwBvExJwWANJDVKEnL-3FljPyQI/rs:fit:720:540:1/g:ce/aHR0cDovL2NkbjIu/ZGluZXJvZW5pbWFn/ZW4uY29tL21lZGlh/L2RpbmVyby9zdHls/ZXMvZ2FsbGVyaWUv/cHVibGljL2ltYWdl/cy8yMDE4LzEwL3Rp/ZW5kaXRhcy1jb21w/ZW5jaWEtb3h4by5q/cGc'
                    class="h-36 object-cover "/>
                <div class="px-3 py-2">
                    <h1 class="font-semibold">{nombre_empresa}</h1>
                    <p className='font-semibold'>{numero_sucursal} </p>
                    <p className='text-sm'>{direccion_empresa}</p>
                    <p class="text-sm">{telefono} </p>
                    <p class="text-sm">{tipo_empresa}</p>
                </div>
        </a>
    )
}
export default Empresa;