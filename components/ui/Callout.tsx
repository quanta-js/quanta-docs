import React from 'react';

type CalloutType = 'info' | 'warning' | 'success';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

const Callout: React.FC<CalloutProps> = ({ type = 'info', children }) => {
  const baseStyles = 'px-4 py-1 my-4 rounded-md border-l-4';
  const typeStyles = {
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-100',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-100',
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-100',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      {children}
    </div>
  );
};

export default Callout;