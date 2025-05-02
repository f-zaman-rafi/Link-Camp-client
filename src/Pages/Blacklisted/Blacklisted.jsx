import React from 'react';

const Blacklisted = () => {
    return (
        // Main container for the blacklisted page, occupying the full viewport.
        <div className='min-h-screen text-center flex justify-center items-center text-3xl mx-auto bg-black text-white'>
            {/* Message displayed to the user indicating their account has been suspended. */}
            <p className=' w-1/2 '>Your account has been temporarily suspended. Please reach out to the administration for further assistance.</p>
        </div>
    );
};

export default Blacklisted;