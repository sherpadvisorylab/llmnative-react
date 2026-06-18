import React from 'react';
import {Link} from "react-router-dom";
import Icon from "../ui/Icon";
import { useI18n } from "../../I18n";


interface SearchProps {
    onQueryChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchButton = () => {
    return (
        <div className="inline-flex">
            <Link
                to="/#"
                data-toggle-class="app-header-menu-search-toggled"
                data-toggle-target=".app"
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                <div className="flex items-center justify-center">
                    <Icon name="search" className="h-4 w-4" />
                </div>
            </Link>
        </div>
    );
};

function Search ({
                     onQueryChange = undefined
}: SearchProps) {
    const dict = useI18n('common');
    return (

        <div>
            <SearchButton />
            <input className={"hidden"} type="text" placeholder={dict.search} onChange={onQueryChange}/>
        </div>
    )
}

export default Search;
