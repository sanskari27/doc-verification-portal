import { AddIcon, CalendarIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Flex,
	IconButton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import Chart from 'react-google-charts';
import { AiOutlineExpand } from 'react-icons/ai';
import { BsExclamationCircleFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { ImStopwatch } from 'react-icons/im';
import { IoCloseCircle } from 'react-icons/io5';
import { RiProgress2Fill } from 'react-icons/ri';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Each from '../../../components/containers/each';
import HighlightedText from '../../../components/containers/HighlightedText';
import AddAgent from '../../../components/dialogs/addAgent';
import CityBasedSummary from '../../../components/dialogs/cityBasedSummary';
import { RoutePath } from '../../../config/const';
import AgentService from '../../../services/agent.service';
import ReportService from '../../../services/report.service';

export function VerificationStatusTable() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['previous-records-summary'],
		queryFn: () => ReportService.getPreviousRecords(5),
	});

	return (
		<Box bgColor={'white'} padding={'1rem'} rounded={'xl'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<HighlightedText
					fontSize={'3xl'}
					fontWeight={'bold'}
					className='text-primary'
					text='Verification Status'
				/>
				<Link to={RoutePath.Table}>
					<IconButton
						colorScheme='blue'
						variant={'ghost'}
						aria-label='Menu'
						className='focus:border-0 focus:outline-none focus:ring-0 active:border-0 active:outline-none active:ring-0'
						icon={<AiOutlineExpand />}
					/>
				</Link>
			</Flex>

			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Status</Th>
							<Th>Date</Th>
							<Th>Type</Th>
						</Tr>
					</Thead>

					<Tbody>
						{isLoading ? (
							<Tr>
								<Td className={'!border-transparent animate-pulse'} colSpan={4}>
									Loading...
								</Td>
							</Tr>
						) : error ? (
							<Tr>
								<Td className={'!border-transparent'} colSpan={4}>
									Error occurred while fetching data
								</Td>
							</Tr>
						) : (
							<Each
								items={data ?? []}
								render={(item) => (
									<Tr>
										<Td className={'!border-transparent'}>
											<HighlightedText text={item.name} />
										</Td>
										<Td className={'!border-transparent'}>
											<VerificationStatusTd status={item.status} />
										</Td>
										<Td className={'!border-transparent'}>{item.dueDate}</Td>
										<Td className={'!border-transparent capitalize'}>{item.verificationType}</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}

function VerificationStatusTd({ status }: { status: string }) {
	return (
		<>
			{status === 'completed' || status === 'accepted-under-review' ? (
				<Flex alignItems={'center'} gap={'0.25rem'}>
					<FaCheckCircle size={'1.25rem'} className='text-green-500' />
					<Text className='text-green-500'>Completed</Text>
				</Flex>
			) : status === 'rejected' ? (
				<Flex alignItems={'center'} gap={'0.25rem'}>
					<IoCloseCircle size={'1.25rem'} className='text-red-500' />
					<Text className='text-red-500'>Rejected</Text>
				</Flex>
			) : status === 'rejected-under-review' ? (
				<Flex alignItems={'center'} gap={'0.25rem'}>
					<BsExclamationCircleFill size={'1.25rem'} className='text-yellow-500' />
					<Text className='text-yellow-500'>Reverification</Text>
				</Flex>
			) : status === 'in-progress' || status === 'paused' ? (
				<Flex alignItems={'center'} gap={'0.25rem'}>
					<ImStopwatch size={'1.25rem'} className='text-yellow-500' />
					<Text className='text-yellow-500'>In Progress</Text>
				</Flex>
			) : (
				<Flex alignItems={'center'} gap={'0.25rem'}>
					<RiProgress2Fill size={'1.25rem'} className='text-gray-500' />
					<Text className='text-gray-500'>Pending</Text>
				</Flex>
			)}
		</>
	);
}

export function CityStatusTable() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['city-records-summary'],
		queryFn: () => ReportService.cityBasedSummary(5),
	});

	return (
		<Box bgColor={'white'} padding={'1rem'} rounded={'xl'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<HighlightedText
					fontSize={'xl'}
					fontWeight={'bold'}
					className='text-blue-800'
					text='City Wise Status'
				/>
				<CityBasedSummary>
					<IconButton
						colorScheme='blue'
						variant={'ghost'}
						aria-label='Menu'
						className='focus:border-0 focus:outline-none focus:ring-0 active:border-0 active:outline-none active:ring-0'
						icon={<AiOutlineExpand />}
					/>
				</CityBasedSummary>
			</Flex>

			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th>City</Th>
							<Th isNumeric>Total</Th>
							<Th isNumeric>Verified</Th>
							<Th isNumeric>Ratio</Th>
						</Tr>
					</Thead>

					<Tbody>
						{isLoading ? (
							<Tr>
								<Td className={'!border-transparent animate-pulse'} colSpan={4}>
									Loading...
								</Td>
							</Tr>
						) : error ? (
							<Tr>
								<Td className={'!border-transparent'} colSpan={4}>
									Error occurred while fetching data
								</Td>
							</Tr>
						) : (
							<Each
								items={data ?? []}
								render={(item) => (
									<Tr>
										<Td className={'!border-transparent'}>
											<HighlightedText text={item.city} />
										</Td>
										<Td className={'!border-transparent'} isNumeric>
											{item.total}
										</Td>
										<Td className={'!border-transparent'} isNumeric>
											{item.verified}
										</Td>
										<Td className={'!border-transparent capitalize'} isNumeric>
											{item.verifiedPercentage}%
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}

export function MonthGraph() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['monthly-report'],
		queryFn: () => ReportService.monthlyReport(),
	});

	const graphData = [
		['Month', 'Verification'],
		...(data?.map((item) => [item.month, item.count]) ?? []),
	];
	const date = new Date();

	const totalVerification = data?.reduce((acc, item) => acc + item.count, 0) ?? 0;

	return (
		<Box bgColor={'white'} padding={'1rem'} rounded={'xl'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box>
					<Flex
						rounded={'lg'}
						className='bg-[#F4F7FE]'
						paddingX={'1rem'}
						paddingY={'0.5rem'}
						alignItems={'center'}
						gap={'0.5rem'}
					>
						<CalendarIcon color={'gray.400'} />
						<Text fontSize={'xl'} fontWeight={'bold'} className='text-gray-400'>
							{date.getFullYear()}
						</Text>
					</Flex>
				</Box>
			</Flex>
			{isLoading ? (
				<Text>Loading...</Text>
			) : error ? (
				<Text>Error occurred while fetching data</Text>
			) : (
				<Flex>
					<Box padding={'2rem'}>
						<Text fontSize={'3xl'} fontWeight={'bold'} className='text-blue-800'>
							{totalVerification}
						</Text>
						<Text fontSize={'sm'} className='-mt-2 text-gray-500'>
							Completed Verification
						</Text>
					</Box>
					<Box>
						{!data || data.length === 0 ? (
							<Text>No data available</Text>
						) : (
							<Chart
								chartType='Line'
								width='100%'
								height='400px'
								data={graphData}
								options={{
									chart: {
										title: 'Monthly Growth',
									},
									legend: { position: 'none' },
								}}
							/>
						)}
					</Box>
				</Flex>
			)}
		</Box>
	);
}

export function MonthPieGraph() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['month-report'],
		queryFn: () => ReportService.monthReport(),
	});

	const graphData = [
		['Status', 'Count'],
		...(data?.map((item) => [item.status, item.count]) ?? []),
	];

	const date = new Date();

	return (
		<Box bgColor={'white'} padding={'1rem'} rounded={'xl'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<Box>
					<Flex
						rounded={'lg'}
						className='bg-[#F4F7FE]'
						paddingX={'1rem'}
						paddingY={'0.5rem'}
						alignItems={'center'}
						gap={'0.5rem'}
					>
						<CalendarIcon color={'gray.400'} />
						<Text fontSize={'xl'} fontWeight={'bold'} className='text-gray-400'>
							{date.toLocaleDateString('default', { month: 'long' })}
						</Text>
					</Flex>
				</Box>
			</Flex>
			{isLoading ? (
				<Text>Loading...</Text>
			) : error ? (
				<Text>Error occurred while fetching data</Text>
			) : (
				<Box width={'full'}>
					{!data || data.length === 0 ? (
						<Text>No data available</Text>
					) : (
						<Chart
							chartType='PieChart'
							width='100%'
							height='400px'
							data={graphData}
							options={{
								chart: {
									title: 'Month Status',
								},
							}}
						/>
					)}
				</Box>
			)}
		</Box>
	);
}

export function AgentTable() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['agents-list'],
		queryFn: () => AgentService.listedAgents(),
	});

	return (
		<Box bgColor={'white'} padding={'1rem'} rounded={'xl'}>
			<Flex justifyContent={'space-between'} alignItems={'center'}>
				<HighlightedText
					fontSize={'xl'}
					fontWeight={'bold'}
					className='text-blue-800'
					text='Team Members'
				/>
				<AddAgent>
					<IconButton
						colorScheme='blue'
						variant={'ghost'}
						aria-label='Menu'
						className='focus:border-0 focus:outline-none focus:ring-0 active:border-0 active:outline-none active:ring-0'
						icon={<AddIcon />}
					/>
				</AddAgent>
			</Flex>

			<Flex>
				{isLoading ? (
					<Text>Loading...</Text>
				) : error ? (
					<Text>Error occurred while fetching data</Text>
				) : (
					<Flex padding={'1rem'} width={'full'}>
						<Flex direction={'column'} gap={'1rem'} width={'full'}>
							{(data ?? []).map((agent) => (
								<Flex
									className='shadow-xl drop-shadow-xl'
									width={'full'}
									paddingY={'0.5rem'}
									paddingX={'1rem'}
									rounded={'lg'}
								>
									<Box padding={'0.5rem'} rounded={'full'} className='border-[#A38DFF] border'>
										<Box>
											<Avatar size='md' name={agent.name} />
										</Box>
									</Box>
									<Flex padding={'0.5rem'} gap={'1rem'} width={'full'}>
										<Flex direction={'column'} gap={'0.25rem'}>
											<HighlightedText text={agent.name} fontSize={'lg'} fontWeight={'bold'} />
											<HighlightedText text={agent.email} fontSize={'sm'} />
										</Flex>
									</Flex>
								</Flex>
							))}
						</Flex>
					</Flex>
				)}
			</Flex>
		</Box>
	);
}
