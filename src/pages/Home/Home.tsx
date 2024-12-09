import React from 'react'
import Navbar from "./../../components/Navbar/Editor"

function Home() {
    return (
        <div className="flex h-screen bg-white">

            <Navbar home={true} />

        </div>
    )
}

export default Home