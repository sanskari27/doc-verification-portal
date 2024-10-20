import { z } from 'zod';

export const AgentSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(3, 'Name must be at least 3 characters'),
	phone: z
		.string()
		.length(10, 'Phone number must be 10 digits')
		.regex(/^\d+$/, 'Invalid phone number'),
});

export type Agent = z.infer<typeof AgentSchema>;
