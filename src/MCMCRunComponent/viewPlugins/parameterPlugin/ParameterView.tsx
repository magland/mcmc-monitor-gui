import { ViewProps } from 'MCMCRunComponent/MCMCRunComponent';
import React, { FunctionComponent } from 'react';
import IterationsPlot from './IterationsPlot';

type Props = {
    width: number
    height: number
    parameterName: string
}

const ParameterView: FunctionComponent<Props & ViewProps> = ({width, height, chains, parameterName}) => {
    return (
        <IterationsPlot
            chains={chains}
            parameterName={parameterName}
            width={width}
            height={height}
        />
    )
}

export default ParameterView