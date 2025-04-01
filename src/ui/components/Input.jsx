export const Input = ({ label, error, size = 'medium', ...props }) => {
    const handleFocus = (e) => {
        if (props.type === 'date') {
            e.target.showPicker(); 
        }
    };


    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-4 py-3 text-lg'
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                className={`w-full ${sizeClasses[size]} border ${
                    error ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-tortisal`}
                onClick={handleFocus}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};
