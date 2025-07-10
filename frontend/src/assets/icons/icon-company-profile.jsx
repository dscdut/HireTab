import { ICON_SIZE_LARGE } from '@/core/configs/icon-size'

// Icon cho Company Profile (Home icon)
const IconCompanyProfile = props => {
    return (
        <svg
            width={ICON_SIZE_LARGE}
            height={ICON_SIZE_LARGE}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3361 2.23111C11.7111 1.92296 12.2889 1.92296 12.6639 2.23111L21.6639 9.23111C21.8752 9.39715 22 9.6408 22 9.9V20C22 20.5523 21.5523 21 21 21H15C14.4477 21 14 20.5523 14 20V14H10V20C10 20.5523 9.55228 21 9 21H3C2.44772 21 2 20.5523 2 20V9.9C2 9.6408 2.12477 9.39715 2.33606 9.23111L11.3361 2.23111ZM4 10.4V19H8V14C8 13.4477 8.44772 13 9 13H15C15.5523 13 16 13.4477 16 14V19H20V10.4L12 4.26667L4 10.4Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default IconCompanyProfile