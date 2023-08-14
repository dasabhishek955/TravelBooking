import React, { useState, useEffect } from 'react';
import Display from './Display'


const Home = () => {
    return (
        <div>
            <h1 className="heading">
                <span>Welcome to the Travel Website</span>
            </h1>
            <Display />
        </div>
    )
}

export default Home
