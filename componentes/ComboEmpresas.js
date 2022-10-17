import React from 'react';

const ComboEmpresas = ({empresa}) => {
    const{id,nombre_empresa} = empresa;
    return ( 
        <option>{nombre_empresa}</option>
    )
}
 
export default ComboEmpresas;