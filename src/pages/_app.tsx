import Head from 'next/head';

import { AuthProvider } from '../contexts/authContext';
import { ProductsProvider } from '../contexts/productsContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <AuthProvider>
      <ProductsProvider>
        <Component {...pageProps} />
      </ProductsProvider>
    </AuthProvider>
  </>
}

export default MyApp;
