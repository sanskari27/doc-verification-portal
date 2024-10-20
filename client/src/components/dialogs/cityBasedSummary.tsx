import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import ReportService from '../../services/report.service';
import Each from '../containers/each';

export default function CityBasedSummary({ children }: { children: React.ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isLoading, error, data } = useQuery({
		queryKey: ['city-records-total'],
		queryFn: () => ReportService.cityBasedSummary(99999),
	});

	return (
		<>
			<Box cursor={'pointer'} onClick={onOpen}>
				{children}
			</Box>

			<Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>City Wise Summary</ModalHeader>
					<ModalCloseButton />
					<ModalBody maxHeight={'500px'} overflowY={'scroll'}>
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
													<Td className={'!border-transparent'}>{item.city}</Td>
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
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='red' onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
