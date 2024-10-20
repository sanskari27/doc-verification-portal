import { EmailIcon } from '@chakra-ui/icons';
import {
	Button,
	Flex,
	Heading,
	HStack,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	PinInput,
	PinInputField,
	Text,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../../config/const';
import AuthService from '../../../services/auth.service';

export default function Login() {
	const [isOtpSent, setOtpSent] = useBoolean();
	const [isLoading, setLoading] = useBoolean();
	const [email, setEmail] = useState<string>('');
	const [otp, setOTP] = useState<string>('');
	const token = useRef<string | null>(null);
	const toast = useToast();
	const navigate = useNavigate();

	async function requestOTP() {
		setLoading.on();
		const data = await AuthService.requestLoginOTP(email);
		setLoading.off();
		if (data) {
			token.current = data;
			setOtpSent.on();
		} else {
			toast({
				title: 'Verification failed',
				description: 'An error occurred while sending OTP.',
				status: 'error',
			});
		}
	}

	async function verifyOTP() {
		if (!token.current) {
			toast({
				title: 'Verification failed',
				description: 'Please refresh the page and try again.',
				status: 'error',
			});
			return;
		}
		setLoading.on();
		const data = await AuthService.verifyOTP(token.current, otp);
		if (data) {
			toast({
				title: 'Verification successful',
				description: 'You have successfully verified your account.',
				status: 'success',
			});
			navigate(RoutePath.Dashboard);
		} else {
			toast({
				title: 'Verification failed',
				description: 'An error occurred while verifying OTP.',
				status: 'error',
			});
		}
		setLoading.off();
	}

	return (
		<Flex width={'100vw'} height={'100vh'} alignItems={'center'} justifyContent={'center'}>
			<Flex width={'80%'} maxWidth={'550px'} height={'400px'} flexDirection={'column'} gap={'5rem'}>
				<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
					<Image src={'/logo.svg'} width={'200px'} />
				</Flex>
				<Flex
					height={'350px'}
					flexDirection={'column'}
					className='shadow-md drop-shadow-md'
					rounded={'xl'}
					padding={'2rem'}
				>
					<Heading textAlign={'center'}>Welcome Back</Heading>
					<Text textAlign={'center'}>Sign in to your account</Text>

					<Flex direction={'column'} gap={'1rem'}>
						{!isOtpSent ? (
							<>
								<InputGroup rounded={'xl'} height={'3rem'} marginTop={'3rem'}>
									<InputLeftElement pointerEvents='none' height={'3rem'}>
										<EmailIcon color='gray.300' width={'1.4rem'} height={'1.4rem'} />
									</InputLeftElement>
									<Input
										rounded={'xl'}
										height={'3rem'}
										type='email'
										placeholder='Enter your email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</InputGroup>
								<Button
									colorScheme='blue'
									height={'3rem'}
									variant='solid'
									rounded={'xl'}
									isLoading={isLoading}
									onClick={requestOTP}
								>
									Request OTP
								</Button>
							</>
						) : (
							<>
								<Flex direction={'column'} width={'full'} marginTop={'0.5rem'}>
									<Text textAlign={'center'}>Enter your 6 digit otp.</Text>
									<HStack justifyContent={'center'} height={'3rem'} marginTop={'1rem'}>
										<PinInput type='number' onChange={(otp) => setOTP(otp)}>
											<PinInputField height={'3rem'} width={'3rem'} />
											<PinInputField height={'3rem'} width={'3rem'} />
											<PinInputField height={'3rem'} width={'3rem'} />
											<PinInputField height={'3rem'} width={'3rem'} />
											<PinInputField height={'3rem'} width={'3rem'} />
											<PinInputField height={'3rem'} width={'3rem'} />
										</PinInput>
									</HStack>
								</Flex>
								<Button
									colorScheme='blue'
									height={'3rem'}
									variant='solid'
									rounded={'xl'}
									onClick={verifyOTP}
									isLoading={isLoading}
								>
									Verify
								</Button>
							</>
						)}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
