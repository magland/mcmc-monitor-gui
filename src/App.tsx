import { MuiThemeProvider } from '@material-ui/core';
import { getFigureData, useWindowDimensions } from 'figurl';
import validateObject, { isEqualTo, isString } from 'figurl/viewInterface/validateObject';
import MCMCRunComponent from 'MCMCRunComponent/MCMCRunComponent';
import React, { useEffect, useState } from 'react';
import theme from 'theme';

type MCMCMonitorData = {
  type: 'mcmcRun',
  runUri: string,
  runLabel: string
}

const isMCMCMonitorData = (x: any): x is MCMCMonitorData => {
  return validateObject(x, {
    type: isEqualTo('mcmcRun'),
    runUri: isString,
    runLabel: isString
  })
}


function App() {
  const [data, setData] = useState<MCMCMonitorData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const {width, height} = useWindowDimensions()

  useEffect(() => {
    getFigureData().then((data: any) => {
      if (!isMCMCMonitorData(data)) {
        setErrorMessage(`Invalid figure data`)
        console.error('Invalid figure data', data)
        return
      }
      setData(data)
    }).catch(err => {
      setErrorMessage(`Error getting figure data`)
      console.error(`Error getting figure data`, err)
    })
  }, [])

  if (errorMessage) {
    return <div style={{color: 'red'}}>{errorMessage}</div>
  }

  if (!data) {
    return <div>Waiting for data</div>
  }

  return (
    <MuiThemeProvider theme={theme}>
      <MCMCRunComponent
        runUri={data.runUri}
        runLabel={data.runLabel}
        width={width - 10}
        height={height - 5}
      />
    </MuiThemeProvider>
  )
}

export default App;
