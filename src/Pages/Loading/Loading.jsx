import React from 'react';
import { RingLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className='max-w-screen min-h-screen flex justify-center items-center'>
            <RingLoader size={60} color="#ff0000" speedMultiplier={1} />
        </div>
    );
};

export default Loading;