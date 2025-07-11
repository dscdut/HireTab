import { ICON_SIZE_LARGE } from '@/core/configs/icon-size'
const IconHelpCenter = props => {
    return (
        <svg
            width={ICON_SIZE_LARGE}
            height={ICON_SIZE_LARGE}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path
                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
    )
}

export default IconHelpCenter;