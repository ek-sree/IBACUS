import { useEffect, useState } from "react"

const useDebounce = <T> (value: T, delay:number=500): T =>{
    const [debouncedValue,setDebouncedValue] = useState(value)

    useEffect(()=>{
        const timerId = setTimeout(() => {
            setDebouncedValue(value)
        },delay)

        return ()=>{
            clearTimeout(timerId)
        }
    },[value,delay])

    return debouncedValue;
}

export default useDebounce;