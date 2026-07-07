import React from 'react';
import {Link} from "react-router-dom";
import {PLACEHOLDER_BRAND, useTheme} from "../../Theme";
import Image from "../ui/Image";
import {Wrapper} from "../ui/GridSystem";

type BrandProps = {
    /** Link target URL for the brand. */
    url?: string;
    /** Brand text label. */
    label?: string;
    /** Logo image URL. */
    logo?: string;
    /** Logo image width. */
    width?: number;
    /** Logo image height. Defaults to `36`. */
    height?: number;
    wrapperClassName?: string;
    className?: string;
    logoClassName?: string;
    labelClassName?: string;
};

const Brand = ({
                   url          = undefined,
                   label        = undefined,
                   logo          = undefined,
                   width        = undefined,
                   height       = 36,
                   wrapperClassName    = undefined,
                   className    = undefined,
                   logoClassName    = undefined,
                   labelClassName   = undefined
}: BrandProps) => {
    const theme = useTheme("brand");
    const Logo = <>
        <Image src={logo || PLACEHOLDER_BRAND}
               width={width}
               height={height}
        />
        {label && <span className={labelClassName || theme.Brand.labelClassName}>{label}</span>}
    </>

    return (<Wrapper className={wrapperClassName}>
        <div className={className || theme.Brand.className}>
            {url
                ? <Link to={url} className={logoClassName || theme.Brand.logoClassName}>{Logo}</Link>
                : <span className={logoClassName || theme.Brand.logoClassName}>{Logo}</span>
            }
        </div>
    </Wrapper>);
}

export default Brand;