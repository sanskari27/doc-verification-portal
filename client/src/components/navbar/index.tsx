import { Box, Flex, Image } from '@chakra-ui/react';
import { FaChartSimple, FaUser } from 'react-icons/fa6';
import { PiUsersThreeLight } from 'react-icons/pi';
import { RiDashboardFill, RiHome6Fill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { RoutePath } from '../../config/const';
import { cn } from '../../utils/tailwind.util';

export default function Navbar() {
	const location = useLocation();

	const isActive = (path: string) => {
		if (path === RoutePath.Dashboard) {
			return location.pathname === '/';
		}
		return location.pathname.includes(path);
	};

	return (
		<Flex minHeight={'100vh'} width={'250px'} className='bg-white' flexDirection='column'>
			<Flex justifyContent={'center'} alignItems={'center'} width={'full'} marginTop={'1rem'}>
				<Image src={'/logo.svg'} width={'150px'} />
			</Flex>
			<Flex
				justifyContent={'center'}
				alignItems={'center'}
				width={'full'}
				marginTop={'3rem'}
				direction={'column'}
			>
				<MenuItem
					icon={<RiHome6Fill size={'1.25rem'} />}
					title={'Dashboard'}
					route={RoutePath.Dashboard}
					isActive={isActive(RoutePath.Dashboard)}
				/>
				<MenuItem
					icon={<PiUsersThreeLight size={'1.25rem'} />}
					title={'Team'}
					route={RoutePath.Team}
					isActive={isActive(RoutePath.Team)}
				/>
				<MenuItem
					icon={<FaChartSimple size={'1.25rem'} />}
					title={'Table'}
					route={RoutePath.Table}
					isActive={isActive(RoutePath.Table)}
				/>
				<MenuItem
					icon={<RiDashboardFill size={'1.25rem'} />}
					title={'Utility'}
					route={RoutePath.Utility}
					isActive={isActive(RoutePath.Utility)}
				/>
				<MenuItem
					icon={<FaUser size={'1.25rem'} />}
					title={'Profile'}
					route={RoutePath.Profile}
					isActive={isActive(RoutePath.Profile)}
				/>
			</Flex>
		</Flex>
	);
}

function MenuItem({
	icon,
	title,
	isActive,
	route,
}: {
	icon: JSX.Element;
	title: string;
	isActive: boolean;
	route: string;
}) {
	return (
		<Link to={route} className='w-full'>
			<Flex
				width={'full'}
				paddingX={'1rem'}
				paddingY={'0.5rem'}
				gap={'0.5rem'}
				alignItems={'center'}
				cursor={'pointer'}
				className={cn(
					'hover:bg-gray-100',
					isActive ? 'text-primary border-r-2 border-r-primary' : 'text-gray-600 border-r-0'
				)}
			>
				<Box>{icon}</Box>
				<Box fontSize={'lg'}>{title}</Box>
			</Flex>
		</Link>
	);
}
