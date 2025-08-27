import React from 'react';

const Input = ({ label, icon, rightElement, ...props }) => (
  <div className='form-control'>
    {label && (
      <label htmlFor={props.name} className='label'>
        <span className='label-text font-medium'>{label}</span>
      </label>
    )}

    <div className='relative'>
      {icon && React.isValidElement(icon) && (
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 z-10'>
          {icon}
        </div>
      )}

      <input
        id={props.name}
        className={`input input-bordered w-full ${icon ? 'pl-10' : ''}`}
        autoComplete='off'
        {...props}
      />

      {rightElement}
    </div>
  </div>
);

export default Input;
