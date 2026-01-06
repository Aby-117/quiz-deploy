import type { AppProps } from 'next/app'
import '../index.css'
import { Providers } from '@/components/Providers'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </Providers>
  )
}


