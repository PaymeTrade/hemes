import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  await account.setBalanceMode('practice')

  const profile = await account.getProfile()

  console.log('\n', 'Balance:', profile.balance)
  console.log('Balance ID:', profile.balance_id, profile.balance_type)
  console.log('Balance type:', profile.balance_type, '\n')
}

run()
