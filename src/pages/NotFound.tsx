import React from 'react';
import {Link} from "react-router-dom";
import Icon from "../components/ui/Icon";
import { useI18n } from "../I18n";

const NotFound: React.FC = () => {
    const dict = useI18n('common');
    return (
        <div className='flex flex-col justify-center items-center vh-100'>
            <h1>404</h1>
            <p>{dict.notFoundMessage}</p>
            <Link to='/'><Icon name="house-door" /> {dict.goHome}</Link>
        </div>
    );
};

export default NotFound;
