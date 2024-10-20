import { SearchIcon } from '@chakra-ui/icons';
import { Avatar, AvatarBadge, Box, Flex, Input } from '@chakra-ui/react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useSearch } from '../../hooks/useSearchText';

export default function NavSearch() {
	const { search, setSearchText } = useSearch();
	return (
		<Flex
			height={'3rem'}
			minW={'300px'}
			backgroundColor={'white'}
			rounded={'full'}
			paddingX={'0.5rem'}
			alignItems={'center'}
			gap={'0.25rem'}
		>
			<Flex
				alignItems={'center'}
				className='bg-background'
				rounded={'full'}
				paddingX={'0.5rem'}
				gap={'0.25rem'}
			>
				<SearchIcon width={'0.75rem'} height={'0.75rem'} />
				<Input
					height={'2.25rem'}
					placeholder='Search'
					variant={'unstyled'}
					value={search}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</Flex>
			<Box className='hover:bg-background' rounded={'full'} padding={'0.5rem'}>
				<IoNotificationsOutline size={'1.25rem'} />
			</Box>
			<Flex
				alignItems={'center'}
				className='hover:bg-background '
				rounded={'full'}
				padding={'0.5rem'}
			>
				<Avatar width={'1.25rem'} height={'1.25rem'}>
					<AvatarBadge boxSize='0.5em' bg='green.500' />
				</Avatar>
			</Flex>
		</Flex>
	);
}
