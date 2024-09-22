import { Parser } from 'json2csv';

export default class CSVHelper {
	static exportReport(
		data: {
			applicationNo: string;
			city: string;
			receivedDate: string;
			agentName: string;
			applicantName: string;
			coApplicantName: string;
			phoneNumbers: string;
			dob: string;
			verificationType: string;
			businessName: string;
			posted: string;
			bankName: string;
			address: string;
		}[]
	): string {
		const fields = [
			{
				label: 'Application No',
				value: 'applicationNo',
			},
			{
				label: 'City',
				value: 'city',
			},
			{
				label: 'Received Date',
				value: 'receivedDate',
			},
			{
				label: 'Agent Name',
				value: 'agentName',
			},
			{
				label: 'Applicant Name',
				value: 'applicantName',
			},
			{
				label: 'Co-Applicant Name',
				value: 'coApplicantName',
			},
			{
				label: 'Phone Numbers',
				value: 'phoneNumbers',
			},
			{
				label: 'DOB',
				value: 'dob',
			},
			{
				label: 'Verification Type',
				value: 'verificationType',
			},
			{
				label: 'Business Name',
				value: 'businessName',
			},
			{
				label: 'Posted',
				value: 'posted',
			},
			{
				label: 'Bank Name',
				value: 'bankName',
			},
			{
				label: 'Address',
				value: 'address',
			},
		];

		const json2csvParser = new Parser({ fields });
		return json2csvParser.parse(data);
	}
}
