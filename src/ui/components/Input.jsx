export const Input = ({ 
    label, 
    error, 
    size = 'medium', 
    mask, // Ejemplo: "####-####-####-####" para tarjetas de crédito
    onChange, 
    ...props 
}) => {
    const handleFocus = (e) => {
        if (props.type === 'date') {
            e.target.showPicker(); 
        }
    };

    const handleKeyDown = (e) => {
        if (props.type === 'number' || props.type === 'tel') {
            if (!/[0-9]/.test(e.key) && 
                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        }
    };

    // Función para aplicar la máscara
    const handleInputChange = (e) => {
        if (!mask) {
            onChange?.(e);
            return;
        }

        const { value } = e.target;
        const numbers = value.replace(/\D/g, ''); // Elimina todo lo que no sea número
        let maskedValue = '';
        let numberIndex = 0;

        // Aplica la máscara carácter por carácter
        for (let i = 0; i < mask.length; i++) {
            if (numberIndex >= numbers.length) break;

            if (mask[i] === '#') {
                maskedValue += numbers[numberIndex];
                numberIndex++;
            } else {
                maskedValue += mask[i];
            }
        }

        // Actualiza el valor del input
        e.target.value = maskedValue;
        onChange?.(e);
    };

    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-4 py-3 text-lg'
    };

    const inputType = props.type === 'number' ? 'tel' : props.type;
    const pattern = props.type === 'number' ? '[0-9]*' : null;

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                className={`w-full ${sizeClasses[size]} border ${
                    error ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-tortisal`}
                onClick={handleFocus}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                type={inputType}
                inputMode={props.type === 'number' ? 'numeric' : undefined}
                pattern={pattern}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};