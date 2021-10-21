import VegaLiteComponent from 'components/VegaLiteComponent/VegaLiteComponent';
import { Chain } from 'MCMCRunComponent/MCMCRunComponent';
import React, { FunctionComponent, useMemo } from 'react';

type Props = {
    width: number
    height: number
    chains: Chain[]
    parameterName: string
}

const specTemplate = (data: any[], x: string, y: string, color: string) => ({
    "config": {
        "view": {
            "continuousWidth": 400,
            "continuousHeight": 300
        }
    },
    "data": {
        "name": "data-057d1956670ab1adb5d81646e00573df"
    },
    "mark": "line",
    "encoding": {
        "color": {
            "type": "nominal",
            "field": color
        },
        "x": {
            "type": "quantitative",
            "field": x
        },
        "y": {
            "type": "quantitative",
            "field": y
        }
    },
    "$schema": "https://vega.github.io/schema/vega-lite/v5.1.0.json",
    "datasets": {
        "data-057d1956670ab1adb5d81646e00573df": data
    }
})

const IterationsPlot: FunctionComponent<Props> = ({chains, parameterName, width, height}) => {
    const spec = useMemo(() => {
        const a = chains.map((chain, jj) => (
            chain.records.map((r: {[key: string]: any}) => ({
                iteration: r['iter_num'] as Number,
                [parameterName]: r[parameterName] || undefined,
                chainId: chain.chainId
            }))
        ))
        const data = ([] as any[]).concat(...a)
        return specTemplate(data, 'iteration', parameterName, 'chainId')
    }, [chains, parameterName])
    return (
        <VegaLiteComponent
            width={width}
            height={height}
            spec={spec}
        />
    )
}

export default IterationsPlot