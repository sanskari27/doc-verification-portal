import * as React from 'react';

const SearchContent = React.createContext<{
	search: string;
	setSearchText: (text: string) => void;
}>({
	search: '',
	setSearchText: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const [search, setSearch] = React.useState('');

	return (
		<SearchContent.Provider
			value={{
				search: search,
				setSearchText: (text) => {
					setSearch(text);
				},
			}}
		>
			{children}
		</SearchContent.Provider>
	);
}

export const useSearchText = () => React.useContext(SearchContent).search;

export const useSearch = () => React.useContext(SearchContent);
