import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navbar';

export default function Home() {
	return (
		<>
			<Flex minHeight={'100vh'} width={'100vw'} className='bg-[#F7F5FD]'>
				<Navbar />
				<Flex width={'full'} height={'100vh'} overflow={'scroll'}>
					<Outlet />
				</Flex>
			</Flex>
		</>
	);
}
