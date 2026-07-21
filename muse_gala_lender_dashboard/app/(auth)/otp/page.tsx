import React, { Suspense } from 'react';
import OtpForm from './_components/OtpForm';

const Otp = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div>Loading</div>}>
                <OtpForm />
            </Suspense>
        </div>
    );
};

export default Otp;