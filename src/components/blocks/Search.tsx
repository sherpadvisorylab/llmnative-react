import React from 'react';
import {Link} from "react-router-dom";
import Icon from "../ui/Icon";


interface SearchProps {
    handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchButton = () => {
    return (
        <div className="menu-item dropdown">
            <Link
                to="/#"
                data-toggle-class="app-header-menu-search-toggled"
                data-toggle-target=".app"
                className="menu-link"
            >
                <div className="menu-icon">
                    <Icon name="search" className="nav-icon" />
                </div>
            </Link>
        </div>
    );
};

function Search ({
                     handleSearch = undefined
}: SearchProps) {
    return (

        <div>
            <SearchButton />
            <input className={"hidden"} type="text" placeholder="Search" onChange={handleSearch}/>
        </div>
    )
}

export default Search;
