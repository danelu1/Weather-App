import SearchPage from "./SearchPage";

const SearchTemperatures = () => {
    return (
        <SearchPage
            type='temperatures'
            updateFields={['id', 'idOras', 'valoare']}
        />
    );
};

export default SearchTemperatures;
