import { Box, Flex } from '@chakra-ui/react';
import HighlightedText from '../../../components/containers/HighlightedText';

export function CardButton({
	title,
	icon,
	onClick,
}: {
	title: string;
	icon: JSX.Element;
	onClick?: () => void;
}) {
	return (
		<Flex
			className='bg-primary'
			width={'300px'}
			height={'6rem'}
			rounded={'xl'}
			padding={'1.5rem'}
			alignItems={'center'}
			userSelect={'none'}
			cursor={'pointer'}
			onClick={onClick}
		>
			<Box className='bg-white' padding={'1rem'} rounded={'full'}>
				<Box className='bg-primary' padding={'0.25rem'} rounded={'full'}>
					{icon}
				</Box>
			</Box>
			<Box marginLeft={'1rem'}>
				<HighlightedText fontSize={'lg'} className='text-white' fontWeight={'bold'} text={title} />
			</Box>
		</Flex>
	);
}
