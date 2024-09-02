import { Parser } from 'json2csv';
export default class CSVHelper {
	static exportPhonebook(records: { [key: string]: string }[]) {
		const allKeys = [...new Set(records.flatMap((record) => Object.keys(record)))];
		const keysWithoutLabel = allKeys.filter((key) => key !== 'labels' && key !== 'salutation');
		const keysWithTags = [
			{
				value: 'salutation',
				label: 'prefix',
			},
			...keysWithoutLabel.map((key) => ({
				value: key,
				label: key,
			})),
			{
				value: 'labels',
				label: 'Tags',
			},
		];

		// Create the parser with the values (unique keys)
		const json2csvParser = new Parser({ fields: keysWithTags });
		const csv = json2csvParser.parse(records);

		return csv;
	}
}
