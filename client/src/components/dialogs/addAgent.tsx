import {
	Box,
	Button,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import queryClient from '../../config/queryClient';
import { Agent, AgentSchema } from '../../schema/agent';
import AgentService from '../../services/agent.service';

export default function AddAgent({ children }: { children: React.ReactNode }) {
	const toast = useToast();
	const [isLoading, setIsLoading] = useBoolean(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	async function addAgent(details: Agent) {
		setIsLoading.on();
		const success = await AgentService.addAgent(details);
		if (!success) {
			setIsLoading.off();
			return toast({
				title: 'Failed to add agent',
				status: 'error',
			});
		}
		toast({
			title: 'Agent added successfully',
			status: 'success',
		});
		onClose();
		queryClient.invalidateQueries({ queryKey: ['agents-list'] });
	}

	const form = useForm<Agent>({
		resolver: zodResolver(AgentSchema), // Apply the zodResolver
	});

	return (
		<>
			<Box cursor={'pointer'} onClick={onOpen}>
				{children}
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Agent</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={form.handleSubmit(addAgent)}>
						<ModalBody>
							<Flex direction='column' width='full' gap={'1rem'}>
								<Box>
									<Text mb='0.5rem'>Name</Text>
									<Input
										{...form.register('name')}
										placeholder='Agent Name'
										rounded={'md'}
										height={'2.5rem'}
									/>
								</Box>
								<Box>
									<Text mb='0.5rem'>Email</Text>
									<Input
										{...form.register('email')}
										placeholder='agent@abc.com'
										rounded={'md'}
										height={'2.5rem'}
									/>
								</Box>
								<Box>
									<Text mb='0.5rem'>Phone</Text>
									<Input
										{...form.register('phone')}
										placeholder='9199XXXXXXXX99'
										rounded={'md'}
										height={'2.5rem'}
									/>
								</Box>
							</Flex>
						</ModalBody>

						<ModalFooter>
							<Button variant='ghost' colorScheme='red' mr={3} onClick={onClose} >
								Close
							</Button>
							<Button
								colorScheme='blue'
								type='submit'
								isLoading={isLoading}
								isDisabled={!form.formState.isValid}
							>
								Save
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
