import React from 'react'

import App from './App.tsx'
import './index.css'
import ReactDOM from 'react-dom/client'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const projectId = '91222ec4c7d553d05264028fb3276d8c'

const metadata = {
    name: 'Emporium',
    description: 'Emporium',
    url: 'https://emporium.app',
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <App />
        </WagmiConfig>
    </React.StrictMode>
)
