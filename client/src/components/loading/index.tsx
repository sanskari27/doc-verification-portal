import React from 'react';

import { Flex, Image } from '@chakra-ui/react';

const Loading = () => {
	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
	};
	return (
		<Flex
			direction={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			flexDirection='column'
			width={'100vw'}
			height={'100vh'}
			className='bg-black/60'
			onClick={handleClick}
			zIndex={99999}
		>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				rounded={'lg'}
				width={'400px'}
				height={'300px'}
				className='border shadow-xl drop-shadow-xl '
				bgColor={'white'}
			>
				<Flex justifyContent={'center'} alignItems={'center'} width={'full'} gap={'1rem'}>
					<Image src={'/logo.svg'} width={'200px'} className='animate-pulse' />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Loading;
