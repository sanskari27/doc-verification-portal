import { Box, Flex, Text } from '@chakra-ui/react';
import HighlightedText from '../../../components/containers/HighlightedText';

export default function AchievementCard({
	title,
	value,
	icon,
}: {
	title: string;
	value: number;
	icon: JSX.Element;
}) {
	return (
		<Flex
			className='bg-white'
			width={'350px'}
			height={'6rem'}
			rounded={'xl'}
			padding={'1.5rem'}
			alignItems={'center'}
			userSelect={'none'}
		>
			<Box className='bg-primary/10' padding={'1rem'} rounded={'full'}>
				{icon}
			</Box>
			<Box marginLeft={'1rem'}>
				<HighlightedText text={title} fontSize={'lg'} fontWeight={'bold'} />
				<Text fontSize={'xl'} fontWeight={'bold'}>
					{value}
				</Text>
			</Box>
		</Flex>
	);
}
