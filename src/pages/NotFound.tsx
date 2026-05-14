import React from 'react';
import {Link} from "react-router-dom";
import Icon from "../components/ui/Icon";

const NotFound: React.FC = () => {
    return (
        <div className='flex flex-col justify-center items-center vh-100'>
            <h1>404</h1>
            <p>Oops! Page not found.</p>
            <Link to='/'><Icon name="house-door" /> Go to Home</Link>
        </div>
    );
};

export default NotFound;
