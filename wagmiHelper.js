// import React from 'https://esm.sh/react@18.2.0'
// import { QueryClient } from 'https://esm.sh/@tanstack/react-query'
// import { createClient } from 'https://esm.sh/viem@2.x'
import { 
    createConfig, 
    createStorage, 
    useAccount ,
    useBalance
} from 'https://esm.sh/wagmi'
import { arbitrumSepolia } from 'https://esm.sh/wagmi/chains'
import { metaMask } from 'https://esm.sh/wagmi/connectors'

const wagmiStorage = createStorage({ storage: localStorage })

const wagmiConfig = createConfig({
    chains: [arbitrumSepolia],
    connectors: [metaMask()],
    storage: wagmiStorage,
    transports: {
      [arbitrumSepolia.id]: http(),
    },
})

window.wagmiAccounts = useAccount({
    wagmiConfig,
})

window.wagmiBalance = function() {
    return useBalance({
        address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
        wagmiConfig,
        unit: 'ether',
    })
}

window.wagmiChainId = useChainId({
    wagmiConfig,
})
