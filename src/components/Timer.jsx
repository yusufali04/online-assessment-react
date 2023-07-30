
import { useState, useEffect } from "react"

const Timer = ({handleSubmit})=>{

    const [count, setCount] = useState(60)
    const [time, setTime] = useState('')

    useEffect(()=>{

        const interval = setInterval(()=>{

            setCount(prevCount => {
                if(prevCount <= 30){
                    document.getElementById('timer').style.color = 'red'
                }
                if (prevCount >= 0) {
                    setTime(formatTime(prevCount))
                    return prevCount - 1;
                } else {
                    clearInterval(interval);
                    handleSubmit()
                    return prevCount;
                }
            })
            
        }, 1000)
        

        return () => {
            clearInterval(interval); // Cleanup the interval on component unmount
        };
    }, [])

    function formatTime(seconds) {
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        const timeString = [minutes, remainingSeconds]
        .map(value => String(value).padStart(2, '0'))
        .join(':');
    
        return timeString;
    }

    return (
        <h1 id="timer">{time}</h1>
    )

}

export default Timer