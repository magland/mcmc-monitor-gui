import { useSubfeed } from 'figurl';
import { sleepMsecNum } from 'figurl/util/sleepMsec';
import { SubfeedMessage } from 'figurl/viewInterface/kacheryTypes';
import MountainWorkspace from 'MountainWorkspace/MountainWorkspace';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const useSimulateLiveSubfeed = (messages: SubfeedMessage[] | undefined, opts: {doSimulate: boolean, delayMsec: number, refreshCode: number}) => {
    const {doSimulate, delayMsec, refreshCode} = opts
    const [simulateIndex, setSimulateIndex] = useState<number>(0)
    const refreshCodeRef = useRef<number>(0)
    useEffect(() => {
        if (!doSimulate) return
        refreshCodeRef.current = refreshCode
        setSimulateIndex(0)
        ;(async () => {
            while (true) {
                if (refreshCode !== refreshCodeRef.current) return
                await sleepMsecNum(delayMsec)
                setSimulateIndex(a => (a + 1))
            }
        })()
    }, [refreshCode, delayMsec, doSimulate])
    if ((doSimulate) && (messages)) {
        return messages.slice(0, simulateIndex)
    }
    else {
        return messages
    }
}

const MCMCRunComponent: FunctionComponent<Props> = ({ width, height, runLabel, runUri }) => {
    const { messages: messages0 } = useSubfeed({ subfeedUri: runUri })

    const [simulateRefreshCode, setSimulateRefreshCode] = useState<number>(0)
    const [doSimulate, setDoSimulate] = useState<boolean>(false)
    const messages = useSimulateLiveSubfeed(messages0, {doSimulate, delayMsec: 1000, refreshCode: simulateRefreshCode})
    const handleSimulateLive = useCallback(() => {
        setSimulateRefreshCode(c => (c + 1))
        setDoSimulate(true)
    }, [])

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
            onSimulateLive={handleSimulateLive}
        />
    )
}

const uniqueSorted = (x: any[]) => {
    const ret = [...new Set(x)]
    ret.sort()
    return ret
}

export default MCMCRunComponent