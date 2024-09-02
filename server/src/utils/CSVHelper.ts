import { Parser } from 'json2csv';
export default class CSVHelper {
	static exportRecords(records: { [key: string]: string }[]) {
		const allKeys = [...new Set(records.flatMap((record) => Object.keys(record)))];
		const keysWithTags = [
			...allKeys.map((key) => ({
				value: key,
				label: key,
			})),
		];

		// Create the parser with the values (unique keys)
		const json2csvParser = new Parser({ fields: keysWithTags });
		const csv = json2csvParser.parse(records);

		return csv;
	}
}
