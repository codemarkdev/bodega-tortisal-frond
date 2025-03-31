
export const Form = ({
  children,
  onSubmit,
  title,
  submitText = 'Enviar',
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-tortisal text-white py-2 px-3 rounded-md hover:bg-tortisal-dark focus:outline-none focus:ring-2 focus:ring-tortisal focus:ring-offset-2 transition-colors"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};


export const FormField = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};