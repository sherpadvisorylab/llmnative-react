import React from 'react';
import {useTheme} from "../../Theme";
import { useI18n } from "../../I18n";
import {generateUniqueId} from "../../libs/utils";

type AutoPlayOptions = {
    interval: number;
    pause: "hover" | "false" | "true";
    wrap: boolean;
};

type CarouselProps = {
    children: React.ReactElement[];
    showIndicators?: boolean;
    showControls?: boolean;
    showCaption?: boolean;
    dark?: boolean;
    autoPlay?: AutoPlayOptions;
    initialSlide?: number;
    renderCaption?: (image: React.ReactElement) => React.ReactElement;
    onSlideClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Carousel = ({
                    children,
                    showIndicators  = false,
                    showControls    = false,
                    showCaption     = false,
                    dark      = false,
                    autoPlay        = undefined,
                    initialSlide      = 0,
                    renderCaption  = undefined,
                    onSlideClick    = undefined,
} : CarouselProps) => {
    const theme = useTheme("carousel");
    const dict = useI18n('common');
    showIndicators = showIndicators || theme.Carousel.showIndicators;
    showControls = showControls || theme.Carousel.showControls;
    showCaption = showCaption || theme.Carousel.showCaption;
    dark = dark || theme.Carousel.dark;
    const themeAutoPlay = theme.Carousel.autoPlay;
    autoPlay = autoPlay || (typeof themeAutoPlay === 'object' ? themeAutoPlay : undefined);


    const [isHover, setIsHover] = React.useState(false);
    const id = generateUniqueId();
    const bgOverlay = dark ? "bg-white" : "bg-dark";
    const textCaption = dark ? "text-gray" : "text-white";

    const Caption = (image : React.ReactElement) : React.ReactElement | null => {
        if (!showCaption) return null;
        if (renderCaption) return renderCaption(image);

        const { alt, description } = image.props;
        if (alt || description) {
            return (
                <div className="carousel-caption hidden md:block opacity-75 bottom-0">
                    {alt && <h5 className={textCaption}>{alt}</h5>}
                    {description && <p>{description}</p>}
                </div>
            );
        }
        return null;
    }

    return (
        <div id={id}
             className={"carousel slide" + (dark ? " carousel-dark" : "")}
             data-bs-ride={autoPlay ? "carousel" : "false"}
             data-bs-interval={autoPlay?.interval || 2000}
             data-bs-pause={autoPlay?.pause || "hover"}
             data-bs-wrap={autoPlay?.wrap || "true"}
             onMouseEnter={() => setIsHover(true)}
             onMouseLeave={() => setIsHover(false)}
        >
            {children.length > 1 && <ol className="carousel-indicators mb-0">
                {showIndicators && children.map((_, index) => {
                    return (
                        <li key={index} data-bs-target={"#" + id} data-bs-slide-to={index} className={index === initialSlide ? "active" : ""}></li>
                    );
                })}
            </ol>}
            <div className="carousel-inner" onClick={onSlideClick} style={{cursor: onSlideClick ? "pointer" : "default"}}>
                {children.map((image, index) => {
                    return (
                        <div key={index} className={`carousel-item${index === initialSlide ? " active" : ""}`}>
                            {image}
                            {(showIndicators || showControls || showCaption) && isHover && <div className={"pointer-events-none absolute top-0 bottom-0 left-0 right-0 opacity-25 " + bgOverlay}></div>}
                            {isHover && Caption(image)}
                        </div>
                    );
                })}
            </div>
            {showControls && isHover && children.length > 1 && <>
                <a className="carousel-control-prev" href={"#" + id} role="button" data-bs-slide="prev"><span className="carousel-control-prev-icon" aria-hidden="true"></span><span className="sr-only">{dict.previous}</span></a>
                <a className="carousel-control-next" href={"#" + id} role="button" data-bs-slide="next"><span className="carousel-control-next-icon" aria-hidden="true"></span><span className="sr-only">{dict.next}</span></a>
            </>}
        </div>
    );
}

export default Carousel;
