import { ICON_SIZE_LARGE } from '@/core/configs/icon-size'

// Icon cho Candidates (Users/People icon)
const IconCandidates = props => {
    return (
        <svg
            width={ICON_SIZE_LARGE}
            height={ICON_SIZE_LARGE}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Person 1 - Left */}
            <circle cx="7" cy="8" r="2" fill="currentColor"/>
            <path
                d="M3 18C3 15.7909 4.79086 14 7 14C9.20914 14 11 15.7909 11 18V19C11 19.5523 10.5523 20 10 20H4C3.44772 20 3 19.5523 3 19V18Z"
                fill="currentColor"
            />
            
            {/* Person 2 - Center */}
            <circle cx="12" cy="6" r="2.5" fill="currentColor"/>
            <path
                d="M7 18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V18Z"
                fill="currentColor"
            />
            
            {/* Person 3 - Right */}
            <circle cx="17" cy="8" r="2" fill="currentColor"/>
            <path
                d="M13 18C13 15.7909 14.7909 14 17 14C19.2091 14 21 15.7909 21 18V19C21 19.5523 20.5523 20 20 20H14C13.4477 20 13 19.5523 13 19V18Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default IconCandidates