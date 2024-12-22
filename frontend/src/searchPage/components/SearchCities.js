import SearchPage from "./SearchPage";

const SearchCities = () => {
    return (
        <SearchPage
            type='cities'
            updateFields={['id', 'idTara', 'nume', 'lat', 'lon']}
        />
    );
};

export default SearchCities;
