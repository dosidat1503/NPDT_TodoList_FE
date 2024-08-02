 
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import  { GlobalProvider } from './context/globalVariables.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root')!).render( 
  <GlobalProvider>
    <QueryClientProvider client={new QueryClient()}>
        <App />
    </QueryClientProvider>
  </GlobalProvider> 
)
