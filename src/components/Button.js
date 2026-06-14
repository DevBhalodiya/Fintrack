import React from 'react';

const Button = ({
  text,
  loading = false,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = true,
}) => {
  const baseStyles =
    'font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-550 hover:to-violet-550 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
    secondary:
      'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800 focus:ring-slate-500 disabled:opacity-50 disabled:pointer-events-none',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-550 hover:to-red-550 text-white shadow-rose-500/10 hover:shadow-rose-500/20 focus:ring-rose-500 disabled:opacity-50 disabled:pointer-events-none',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-550 hover:to-teal-550 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {text}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
