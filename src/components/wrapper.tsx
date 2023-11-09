import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'

export const Wrapper = () => {
    const { open } = useWeb3Modal()
    const { address } = useAccount()

    return (
        <>
            <Button onClick={() => open({ view: 'Networks' })}>Networks</Button>
            <Button onClick={() => open()}>Connect</Button>

            <p>Connected Address: {address ? address : 'Not Connected'}</p>
        </>
    )
}
