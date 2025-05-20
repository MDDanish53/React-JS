import React, {useId} from 'react'

function Select({
    label,
    options,
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className = 'w-full'>
            {label && <label htmlFor={id} className=''></label>}
            <select
            {...props}
            id={id}
            ref={ref}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            >
                //options are in array, if array contains values then only apply the map method 
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

//as we hadn't forwarded the reference above so we do :
export default React.forwardRef(Select)