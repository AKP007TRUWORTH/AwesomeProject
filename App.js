
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import useAppUpdate from './src/hooks/useAppUpdate'
import React, { useEffect } from 'react'

import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { AppNavigator } from './src/Navigator'
import * as eva from '@eva-design/eva'

const App = () => {
  const { UpdateAvailableModal, checkForUpdates, restartRequired } = useAppUpdate()

  useEffect(() => {
    checkForUpdates()
  }, [])

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppNavigator />
        <UpdateAvailableModal visible={restartRequired} />
      </ApplicationProvider>
    </>
  )
}

export default App