import { ViewProps } from 'MCMCRunComponent/MCMCRunComponent';
import React, { FunctionComponent } from 'react';
import ChainsTable from './ChainsTable';

type Props = {
    width: number
    height: number
}

const RunOverviewView: FunctionComponent<Props & ViewProps> = ({parameterNames, chains}) => {
    return (
        <div>
            <div>Parameters: {parameterNames.join(', ')}</div>
            <ChainsTable
                chains={chains}
            />
        </div>
    )
}

export default RunOverviewView