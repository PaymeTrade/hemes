import { AxiosInstance } from 'axios'

import { Hemes } from '@hemes/core'
import {
  IQOptionProvider,
  BaseIQOptionProvider,
  BaseWebSocketClient,
  WebSocketEventHistory,
  BaseIQOptionAccount,
  WebSocketClient,
} from '@hemes/iqoption'

import { SsidRequest } from '../lib/websocket/events/requests/SSID'

const mockWebSocketClient = {
  subscribe: jest.fn(),
  send: jest.fn(),
  waitFor: jest.fn(),
}

const mockIqOptionAccount = {
  getProfile: jest.fn(),
  setBalanceMode: jest.fn(),
  getActiveProfit: jest.fn(),
  isActiveEnabled: jest.fn(),
  getOpenAssets: jest.fn(),
  placeDigitalOption: jest.fn(),
  openBinaryOption: jest.fn(),
  getPosition: jest.fn(),
  getPositionState: jest.fn(),
  getCandles: jest.fn(),
}

jest.mock('../lib/websocket/WebSocketClient', () => ({
  WebSocketClient: class MockWebSocketClient implements BaseWebSocketClient {
    history: WebSocketEventHistory[]

    refreshLogIn(): Promise<void> {
      return Promise.resolve()
    }

    subscribe() {
      return mockWebSocketClient.subscribe()
    }

    send(...args: any[]) {
      return mockWebSocketClient.send(...args)
    }

    waitFor(...args: any[]) {
      return mockWebSocketClient.send(...args)
    }
  },
}))

jest.mock('../lib/IQOptionAccount', () => ({
  IQOptionAccount: class MockIQOptionAccount implements BaseIQOptionAccount {
    api: AxiosInstance
    webSocket: WebSocketClient

    getProfile() {
      return mockIqOptionAccount.getProfile()
    }

    setBalanceMode(...args: any[]) {
      return mockIqOptionAccount.setBalanceMode(...args)
    }

    getActiveProfit(...args: any[]) {
      return mockIqOptionAccount.getActiveProfit(...args)
    }

    isActiveEnabled(...args: any[]) {
      return mockIqOptionAccount.isActiveEnabled(...args)
    }

    getOpenAssets(...args: any[]) {
      return mockIqOptionAccount.getOpenAssets(...args)
    }

    placeDigitalOption(...args: any[]) {
      return mockIqOptionAccount.placeDigitalOption(...args)
    }

    openBinaryOption(...args: any[]) {
      return mockIqOptionAccount.openBinaryOption(...args)
    }

    getPosition(...args: any[]) {
      return mockIqOptionAccount.getPosition(...args)
    }

    getPositionState(...args: any[]) {
      return mockIqOptionAccount.getPositionState(...args)
    }

    getCandles(...args: any[]) {
      return mockIqOptionAccount.getCandles(...args)
    }
  },
}))

let hemes: BaseIQOptionProvider

describe('IQOptionProvider', () => {
  beforeEach(() => {
    hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()
  })

  it('should be able to log in with correct credentials', async () => {
    const account = await hemes.logIn({
      email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
      password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
    })

    expect(account).toBeTruthy()

    expect(mockWebSocketClient.subscribe).toBeCalled()
    expect(mockWebSocketClient.send).toBeCalledWith(
      SsidRequest,
      expect.any(String)
    )

    expect(mockIqOptionAccount.setBalanceMode).toBeCalled()
  })
})
