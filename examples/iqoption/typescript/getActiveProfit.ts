import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const profit = await account.getActiveProfit(
    'EURUSD-OTC',
    'binary-option',
    'm1'
  )

  console.log('\n', 'Active profit:', profit, '\n')
}

run()
