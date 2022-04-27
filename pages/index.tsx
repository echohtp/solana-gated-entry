import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Navbar } from '../components/navbar'
import { useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, Transaction, PublicKey } from '@solana/web3.js'
import { gql } from '@apollo/client'
import client from '../client'


const approvedAccounts = ['bMNNqMZ7FS9Jx45Fft2KRD3ouatHjzxKmvYWaM5dARv']

const Home: NextPage = () => {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const GET_NFTS = gql`
    query GetNfts($owners: [PublicKey!], $limit: Int!, $offset: Int!) {
      nfts(owners: $owners, limit: $limit, offset: $offset) {
        address
        mintAddress
        name
        description
        image
        owner {
          address
          associatedTokenAccountAddress
        }
      }
    }
  `

  interface Nft {
    name: string
    address: string
    description: string
    image: string
    mintAddress: string
  }

  const [nfts, setNfts] = useState<Nft[]>([])
  const [allowed, setAllowed] = useState(false)
  

  useMemo(() => {
    if (publicKey?.toBase58()) {
      client
        .query({
          query: GET_NFTS,
          variables: {
            owners: [publicKey?.toBase58()],
            offset: 0,
            limit: 200
          }
        })
        .then(res => setNfts(res.data.nfts))
        .then(()=>{
          nfts.map((e)=>{
            if (approvedAccounts.includes(e.address)){
              console.log('found one ')
              setAllowed(true)
            }
          })
        })
    } else {
      setNfts([])
      setAllowed(false)
    }
  }, [publicKey?.toBase58()])

  return (
    <div>
      <Head>
        <title>Gated Entry</title>
        <meta name='description' content='Solana Gated Entry' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <div className='container'>
        <h1>Connected to: {publicKey?.toBase58()}</h1>
        {allowed ? <h1>✅</h1>: <h1>🚫</h1>}
      </div>

      <div>
        <ul>
          {nfts.map((e)=>
            <li>{e.address}</li>)}
        </ul>
      </div>

      <footer></footer>
    </div>
  )
}

export default Home
