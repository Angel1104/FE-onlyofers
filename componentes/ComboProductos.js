import React from 'react';

const ComboProductos = ({TipoProducto}) => {
    const{id,tipo_producto} = TipoProducto;
    return ( 
        <option>{tipo_producto}</option>
    )
}
 
export default ComboProductos;