import NiceTable from 'components/NiceTable/NiceTable';
import { Chain } from 'MCMCRunComponent/MCMCRunComponent';
import React, { FunctionComponent, useCallback, useMemo } from 'react';

type Props = {
    chains: Chain[]
    selectedChainIds?: number[]
    onSelectedChainIdsChanged?: (x: number[]) => void
}

const columns = [
    {
        key: 'chainId',
        label: 'Chain'
    },
    {
        key: 'numRecords',
        label: 'Num. Records'
    }
]

const ChainsTable: FunctionComponent<Props> = ({chains, selectedChainIds, onSelectedChainIdsChanged}) => {
    const rows = useMemo(() => (
        chains.map((chain) => ({
            key: chain.chainId + '',
            columnValues: {
                chainId: chain.chainId,
                numRecords: chain.records.length
            }
        }))
    ), [chains])
    const handleSelectedRowKeysChanged = useCallback((keys: string[]) => {
        onSelectedChainIdsChanged && onSelectedChainIdsChanged(keys.map(k => (Number(k))))
    }, [onSelectedChainIdsChanged])
    const selectedRowKeys = useMemo(() => (
        selectedChainIds ? selectedChainIds.map(id => (`${id}`)) : undefined
    ), [selectedChainIds])
    return (
        <NiceTable
            rows={rows}
            columns={columns}
            selectedRowKeys={selectedRowKeys}
            onSelectedRowKeysChanged={onSelectedChainIdsChanged && handleSelectedRowKeysChanged}
            selectionMode={selectedChainIds !== undefined ? "multiple" : undefined}
        />
    )
}

export default ChainsTable