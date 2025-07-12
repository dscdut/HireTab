import { ICON_SIZE_LARGE } from '@/core/configs/icon-size'

// Icon cho Job Posting (Briefcase/Suitcase icon)
const IconJobPosting = props => {
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
                d="M9 7V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V7H18C19.6569 7 21 8.34315 21 10V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V10C3 8.34315 4.34315 7 6 7H9ZM13 7V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V7H13ZM6 9C5.44772 9 5 9.44772 5 10V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V10C19 9.44772 18.5523 9 18 9H6Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 13C9 12.4477 9.44772 12 10 12H14C14.5523 12 15 12.4477 15 13C15 13.5523 14.5523 14 14 14H10C9.44772 14 9 13.5523 9 13Z"
                fill="currentColor"
            />
        </svg>
    )
}
export default IconJobPosting
