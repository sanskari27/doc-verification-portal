import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import App from './App';
import queryClient from './config/queryClient';
import { SearchProvider } from './hooks/useSearchText';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider toastOptions={{ defaultOptions: { position: 'top', variant: 'top-accent' } }}>
				<SearchProvider>
					{/* <Provider store={store}> */}
					<App />
					{/* </Provider> */}
				</SearchProvider>
			</ChakraProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
