import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { FaChartSimple } from 'react-icons/fa6';
import { GrAdd } from 'react-icons/gr';
import { useQuery } from 'react-query';
import HighlightedText from '../../components/containers/HighlightedText';
import NavSearch from '../../components/navSearch';
import ReportService from '../../services/report.service';
import AchievementCard from './components/achievementCard';
import { CardButton } from './components/cards';
import {
	AgentTable,
	CityStatusTable,
	MonthGraph,
	MonthPieGraph,
	VerificationStatusTable,
} from './components/table';

export default function Dashboard() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['summary'],
		queryFn: () => ReportService.summary(),
	});

	return (
		<Flex flexDirection={'column'} gap={'1rem'} padding={'1rem'} width={'full'}>
			<Flex justifyContent={'space-between'} width={'full'}>
				<Box>
					<HighlightedText
						fontSize={'3xl'}
						fontWeight={'bold'}
						className='text-primary'
						text='Main Dashboard'
					/>
				</Box>
				<NavSearch />
			</Flex>

			<Box>
				<Box>
					<CardButton title={'New Task'} icon={<GrAdd className='text-white' size={'0.75rem'} />} />
				</Box>
				{isLoading ? (
					<Text fontSize={'lg'} fontWeight={'bold'} textAlign={'center'}>
						Loading...
					</Text>
				) : error ? (
					<Text fontSize={'lg'} fontWeight={'bold'} className='text-red-500' textAlign={'center'}>
						Error occurred while fetching data
					</Text>
				) : (
					<Grid gap={'1rem'} marginTop={'1rem'} templateColumns='repeat(4, 1fr)'>
						<GridItem>
							<AchievementCard
								title={'Total Verification'}
								value={data?.total ?? 0}
								icon={<FaChartSimple className='text-primary/90' size={'1.5rem'} />}
							/>
						</GridItem>
						<GridItem>
							<AchievementCard
								title={'Verified'}
								value={data?.verified ?? 0}
								icon={<FaChartSimple className='text-primary/90' size={'1.5rem'} />}
							/>
						</GridItem>
						<GridItem>
							<AchievementCard
								title={'Non Verified'}
								value={data?.notStarted ?? 0}
								icon={<FaChartSimple className='text-primary/90' size={'1.5rem'} />}
							/>
						</GridItem>
						<GridItem>
							<AchievementCard
								title={'KYC Required'}
								value={data?.reKYCRequired ?? 0}
								icon={<FaChartSimple className='text-primary/90' size={'1.5rem'} />}
							/>
						</GridItem>
					</Grid>
				)}
			</Box>
			<Box>
				<Flex justifyContent={'center'} width={'full'} gap={6}>
					<Flex direction={'column'} width={'50%'} gap={6}>
						<VerificationStatusTable />
						<MonthGraph />
						<MonthPieGraph />
					</Flex>
					<Flex direction={'column'} width={'50%'} gap={6}>
						<CityStatusTable />
						<AgentTable />
					</Flex>
				</Flex>
				{/* <Grid templateColumns='repeat(2, 1fr)' gap={6} autoRows={'minmax(10px, auto)'}>
					<GridItem w='100%'>
						<VerificationStatusTable />
					</GridItem>
					<GridItem w='100%'>
						<CityStatusTable />
					</GridItem>
					<GridItem w='100%'>
						<MonthGraph />
					</GridItem>
					<GridItem w='100%'>
						<AgentTable />
					</GridItem>
					<GridItem w='100%'>
						<MonthPieGraph />
					</GridItem>
				</Grid> */}
			</Box>
		</Flex>
	);
}
