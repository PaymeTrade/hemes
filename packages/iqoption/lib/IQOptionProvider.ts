import axios, { AxiosInstance } from 'axios'

import { cors } from '@base-sdk/core'
import { sleep } from '@hemes/core'

import { IQOptionAccount } from './IQOptionAccount'
import {
  BaseIQOptionAccount,
  BaseIQOptionProvider,
  LogInCredentials,
} from './types'
import { SsidRequest } from './websocket/events/requests/SSID'
import { WebSocketClient } from './websocket/WebSocketClient'

interface LoginResponse {
  code: string
  ssid: string
}

export class IQOptionProvider implements BaseIQOptionProvider {
  private api: AxiosInstance
  private webSocket: WebSocketClient

  private isCorsBypassEnabled: boolean

  constructor() {
    this.api = axios.create({
      baseURL: 'https://trade.gomerebroker.com/api',
    })

    this.webSocket = new WebSocketClient()
  }

  public async enableCorsBypass(): Promise<void> {
    this.isCorsBypassEnabled = true

    cors.useAxiosCors(this.api)
  }

  public async logIn({
    email,
    password,
  }: LogInCredentials): Promise<BaseIQOptionAccount> {
    console.log('Logging in...')

    await this.webSocket.subscribe()

    const authApi = axios.create({
      baseURL: 'https://api.trade.gomerebroker.com/v2/',
    })

    if (this.isCorsBypassEnabled) {
      cors.useAxiosCors(authApi)
    }

    const response = await authApi.post<LoginResponse>('/login', {
      identifier: email,
      password,
    })

    console.log('Logged in')

    this.api.defaults.headers.Authorization = `SSID ${response.data.ssid}`

    if (response.data.code !== 'success') {
      throw new Error('Login failed')
    }

    await this.webSocket.send(SsidRequest, response.data.ssid)

    await sleep(5000)

    const account = new IQOptionAccount(this.api, this.webSocket)

    await account.setBalanceMode('practice')

    return account
  }
}
