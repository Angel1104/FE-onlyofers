import React from 'react';

const ComboTipEmpresas = ({TipoEmpresa}) => {
    const{id,tipo_empresa} = TipoEmpresa;
    return ( 
        <option>{tipo_empresa}</option>
    )
}
 
export default ComboTipEmpresas;