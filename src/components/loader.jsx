import React from "react"
import Loader from 'react-loader-spinner'

const CustomLoader = () => {
    return(
     <Loader
        type="Rings"
        color="grey"
        height={500}
        width={600}
        // timeout={3000} //3 secs
     />
    );
}

export default CustomLoader;