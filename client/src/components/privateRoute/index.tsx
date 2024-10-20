import { useBoolean } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RoutePath } from '../../config/const';
import AuthService from '../../services/auth.service';
import Loading from '../loading';

export default function PrivateRoute({
	reverse,
	children,
}: {
	reverse?: boolean;
	children?: React.ReactNode;
}) {
	const [isLoading, setLoading] = useBoolean(true);
	const [isAuthenticated, setAuthenticated] = useBoolean(false);

	useEffect(() => {
		AuthService.isAuthenticated().then((success) => {
			if (success) {
				setAuthenticated.on();
			} else {
				setAuthenticated.off();
			}
			setLoading.off();
		});
	}, [setAuthenticated, setLoading]);

	if (isLoading) {
		return <Loading />;
	}

	if (reverse) {
		return isAuthenticated ? <Navigate to={RoutePath.Dashboard} /> : children || <Outlet />;
	}

	return isAuthenticated ? children || <Outlet /> : <Navigate to={RoutePath.Login} />;
}
