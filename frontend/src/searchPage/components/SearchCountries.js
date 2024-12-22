import SearchPage from "./SearchPage";

const SearchCountries = () => {
    return (
        <SearchPage
            type='countries'
            updateFields={['id', 'nume', 'lat', 'lon']}
        />
    );
};

export default SearchCountries;
