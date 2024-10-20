// export default function HighlightText({ term, text }) {
// 	if (!term) return text;

import { Text, TextProps } from '@chakra-ui/react';
import { useSearchText } from '../../hooks/useSearchText';

// 	// Splitting the text based on the search term (case insensitive)
// 	const parts = text.split(new RegExp(`(${term})`, 'gi'));

// 	return (
// 		<span>
// 			{parts.map((part, index) =>
// 				// Highlight the part that matches the term
// 				part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
// 			)}
// 		</span>
// 	);
// }

type HighlightedTextProps = TextProps & {
	text: string;
};

export default function HighlightedText({ text, ...rest }: HighlightedTextProps) {
	const term = useSearchText();
	if (!term) return <Text {...rest}>{text}</Text>;

	// Splitting the text based on the search term (case insensitive)
	const parts = text.split(new RegExp(`(${term})`, 'gi'));

	return (
		<Text {...rest}>
			{parts.map((part, index) =>
				part.toLowerCase() === term.toLowerCase() ? (
					<mark
						key={index}
						style={{
							fontWeight: 'bold',
						}}
					>
						{part}
					</mark>
				) : (
					part
				)
			)}
		</Text>
	);
}
