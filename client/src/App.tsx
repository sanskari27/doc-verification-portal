import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';
import Loading from './components/loading';
import PrivateRoute from './components/privateRoute';
import { RoutePath } from './config/const';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import Home from './pages/home';

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
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route element={<PrivateRoute />}>
							<Route path='/' element={<Home />}>
								<Route path={RoutePath.Dashboard} element={<Dashboard />} />
								<Route path={RoutePath.Table} element={<>Table</>} />
								<Route path={RoutePath.Team} element={<>Team</>} />
								<Route path={RoutePath.Utility} element={<>Utitlity</>} />
								<Route path={RoutePath.Profile} element={<>Profile</>} />
							</Route>
						</Route>
						<Route
							path={RoutePath.Login}
							element={
								<PrivateRoute reverse>
									<Login />
								</PrivateRoute>
							}
						/>

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

export default App;
