import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';

import { Flex, Image } from '@chakra-ui/react';

// const Welcome = lazy(() => import('./views/pages/welcome'));
// const Scheduler = lazy(() => import('./views/pages/scheduler'));
// const Bot = lazy(() => import('./views/pages/bot'));
// const Home = lazy(() => import('./views/pages/home'));
// const Tasks = lazy(() => import('./views/pages/tasks'));
// const Report = lazy(() => import('./views/pages/report'));
// const LinkShortner = lazy(() => import('./views/pages/link-shortner'));
// const Contact = lazy(() => import('./views/pages/contacts'));
// const Attachments = lazy(() => import('./views/pages/attachments'));
// const CSVUpload = lazy(() => import('./views/pages/csv-upload'));
// const PollReport = lazy(() => import('./views/pages/polls-report'));
// const GroupMergePage = lazy(() => import('./views/pages/merge-group'));
// const NetworkError = lazy(() => import('./views/pages/network-error'));

function App() {
	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background'>
			<Loading />
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						{/* <Route path={NAVIGATION.WELCOME} element={<Welcome />} />
            <Route path={NAVIGATION.OPEN + '/:id'} element={<Open />} />
            <Route path={NAVIGATION.HOME} element={<Home />}>
              <Route path={NAVIGATION.CONTACT} element={<Contact />} />
              <Route path={NAVIGATION.SCHEDULER} element={<Scheduler />} />
              <Route path={NAVIGATION.BOT} element={<Bot />} />
              <Route path={NAVIGATION.REPORTS} element={<Report />} />
              <Route path={NAVIGATION.SHORT} element={<LinkShortner />} />
              <Route path={NAVIGATION.ATTACHMENTS} element={<Attachments />} />
              <Route path={NAVIGATION.CSV} element={<CSVUpload />} />
              <Route path={NAVIGATION.POLL_RESPONSES} element={<PollReport />} />
              <Route path={NAVIGATION.GROUP_MERGE} element={<GroupMergePage />} />
              <Route path={NAVIGATION.TASKS} element={<Tasks />} />
            </Route>
            <Route path={NAVIGATION.NETWORK_ERROR} element={<NetworkError />} />
            <Route path='*' element={<Navigate to={NAVIGATION.WELCOME} />} /> */}
					</Routes>
				</Suspense>
			</Router>
		</Flex>
	);
}

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

export default App;
