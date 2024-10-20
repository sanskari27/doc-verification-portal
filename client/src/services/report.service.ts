import API from '../config/API';

export default class ReportService {
	static async getPreviousRecords(limit = 5) {
		const { data } = await API.get(`/report/previous-records-summary?limit=${limit}`);
		return (data.records ?? []) as {
			name: string;
			status:
				| 'pending'
				| 'in-progress'
				| 'paused'
				| 'accepted-under-review'
				| 'rejected-under-review'
				| 'completed'
				| 'rejected';
			dueDate: string;
			verificationType: 'business' | 'non-business' | 'nri';
		}[];
	}
	static async cityBasedSummary(limit = 5) {
		const { data } = await API.get(`/report/city-records-summary?limit=${limit}`);
		return (data.records ?? []) as {
			city: string;
			verified: number;
			total: number;
			verifiedPercentage: string;
		}[];
	}
	static async monthlyReport(year?: number) {
		const _year = year || new Date().getFullYear();
		const { data } = await API.get(`/report/monthly-report?year=${_year}`);
		return (data.records ?? []) as {
			month: string;
			count: number;
		}[];
	}
	static async monthReport(month?: number, year?: number) {
		const { data } = await API.get(`/report/month-report?month=${month}&year=${year}`);
		return (data.records ?? []) as {
			status: string;
			count: number;
		}[];
	}
	static async summary() {
		const { data } = await API.get(`/report/summary`);
		return (data.summary ?? {
			total: 0,
			verified: 0,
			notStarted: 0,
			reKYCRequired: 0,
		}) as {
			total: number;
			verified: number;
			notStarted: number;
			reKYCRequired: number;
		};
	}
}
