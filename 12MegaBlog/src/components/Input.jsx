import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
    //generate unique id 
  const id = useId();

  return (
    <div className="w-full">
        {/*if label is provided by the user then display the label by creating it*/}
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>    
      )}
      {/*this gives us reference of parent component, for this we used forwardRef. reference will be passed from user from component and access of state will be taken from here, doing this input values will be taken*/}
      <input
      type = {type}
      className = {`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}  
      ref={ref}
      {...props}
      id={id} 
      />
      {/*id of label and its corresponding input is the same*/}
    </div>
  );
});

export default Input;
