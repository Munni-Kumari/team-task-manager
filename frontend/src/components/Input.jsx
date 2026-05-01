import React from 'react';

const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input-field ${className}`} {...props} />
    </div>
  );
};

export default Input;
