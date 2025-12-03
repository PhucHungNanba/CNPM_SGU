import React from 'react';

// Component ErrorDisplay (đã chỉnh theo theme tối)
const ErrorDisplay = ({ message }) => {
    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Đã xảy ra lỗi! </strong>
                <span className="block sm:inline ml-2">
                    {message || 'Đã xảy ra lỗi không mong muốn.'}
                </span>
            </div>
        </div>
    );
};

export default ErrorDisplay;