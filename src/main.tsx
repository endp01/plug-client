import React from 'react'

import App from './App.tsx'
import './index.css'
import ReactDOM from 'react-dom/client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import {
    createTRPCProxyClient,
    createWSClient,
    httpBatchLink,
    splitLink,
    wsLink
} from '@trpc/client'

import { AppRouter } from '../../server/api'

import Permission from './pages/Permission.tsx'
import Intents from './pages/Intents.tsx'

const projectId = '91222ec4c7d553d05264028fb3276d8c'

const metadata = {
    name: 'Emporium',
    description: 'Emporium',
    url: 'https://emporium.app',
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

const wsClient = createWSClient({
    url: 'ws://localhost:3000/trpc'
})
const client = createTRPCProxyClient<AppRouter>({
    links: [
        splitLink({
            condition: op => {
                return op.type === 'subscription'
            },
            true: wsLink({
                client: wsClient
            }),
            false: httpBatchLink({
                url: 'http://localhost:3000/trpc'
            })
        })
    ]
})

const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/permission', element: <Permission client={client} /> },
    { path: '/intents', element: <Intents client={client} /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RouterProvider router={router} />
        </WagmiConfig>
    </React.StrictMode>
)
