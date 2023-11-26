"use client"

import { CircleUser } from "lucide-react"

const AuthUserButton = ({ currentUser }) => {

    return (
        <>
            {currentUser && (
                <div className="flex items-center gap-x-2 hover:bg-gray-300/10 transition-all duration-300 ease-in-out rounded-md p-2 cursor-pointer">
                    <CircleUser />
                    <p>{`${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name} `}</p>
                </div>
            )}
        </>
    )
}

export default AuthUserButton