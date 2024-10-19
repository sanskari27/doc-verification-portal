import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/* <Provider store={store}> */}
		<ChakraProvider toastOptions={{ defaultOptions: { position: 'top', variant: 'top-accent' } }}>
			<App />
		</ChakraProvider>
		{/* </Provider> */}
	</React.StrictMode>
);
