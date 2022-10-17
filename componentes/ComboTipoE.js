import React from 'react';

const ComboTipoE = ({TipoEmpresa}) => {
    const{id,tipo_empresa} = TipoEmpresa;
    return ( 
        <option>{tipo_empresa}</option>
    )
}
 
export default ComboTipoE;