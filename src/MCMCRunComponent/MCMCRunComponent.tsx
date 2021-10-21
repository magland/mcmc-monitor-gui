import { useSubfeed } from 'figurl';
import MountainWorkspace from 'MountainWorkspace/MountainWorkspace';
import React, { FunctionComponent, useMemo } from 'react';
import parameterPlugin from './viewPlugins/parameterPlugin/parameterPlugin';
import runOverviewPlugin from './viewPlugins/runOverviewPlugin/runOverviewPlugin';

type Props = {
    runUri: string
    runLabel: string
    width: number
    height: number
}

type Record = { [key: string]: any }

export type Chain = {
    chainId: number
    records: { [key: string]: any }
}

export interface ViewProps {
    parameterNames: string[]
    chains: Chain[]
}

const MCMCRunComponent: FunctionComponent<Props> = ({ width, height, runLabel, runUri }) => {
    const { messages } = useSubfeed({ subfeedUri: runUri })
    const records: Record[] = useMemo(() => {
        if (!messages) return []
        return ([] as Record[]).concat(...messages.map(msg => (msg.records as Record[])))
    }, [messages])
    const parameterNames: string[] = useMemo(() => {
        const pnames: string[] = []
        if (records.length === 0) {
            return []
        }
        for (let k in records[0]) {
            if (!['iter_num', 'chain_id', 'timestamp'].includes(k)) {
                pnames.push(k)
            }
        }
        return pnames
    }, [records])

    const chains: Chain[] = useMemo(() => {
        const chainIds = uniqueSorted(records.map(r => (r.chain_id)))
        return chainIds.map(chainId => ({
            chainId,
            records: records.filter(r => (r.chain_id === chainId))
        }))
    }, [records])

    const viewProps: ViewProps = useMemo(() => ({
        parameterNames,
        chains
    }), [parameterNames, chains])

    const viewPlugins = useMemo(() => ([
        runOverviewPlugin,
        ...parameterNames.map(
            pname => (parameterPlugin(pname))
        )
    ]), [parameterNames])

    return (
        <MountainWorkspace
            width={width}
            height={height}
            viewPlugins={viewPlugins}
            viewProps={viewProps}
        />
    )
}

const uniqueSorted = (x: any[]) => {
    const ret = [...new Set(x)]
    ret.sort()
    return ret
}

export default MCMCRunComponent