import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Success = ({results}) => {
  const [counter, setCounter] = useState(10);
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCount) => {
        if (prevCount > 0) {
          return prevCount - 1;
        } else {
          clearInterval(interval);
          setComplete(true)
          return prevCount;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup the interval on component unmount
    };
  }, []);

  if(complete){
    setTimeout(()=>{
      document.exitFullscreen()
    }, 1000)
  }

  return (
    <div className="submit-wrapper">
      {
        complete? (
            <div style={{width: "fit-content"}}>
                {
                    results.shortlisted? <img style={{width: "15rem", margin: "auto", display: "block"}} src="/success.gif" alt="" />: ''
                }
                {
                    results.shortlisted? <h1>Congratulations! You have been shortlisted</h1> : <h1>Sorry! You are not shortlisted</h1>
                }
                <div style={{width: "60%", display: "flex", justifyContent: "space-between", margin: "2rem auto"}}>
                    <div className="show-result" style={{textAlign: 'center'}}>
                      <h2>{results.correct}</h2>
                      <h4 style={{}}>Correct</h4>
                    </div>
                    <div className="show-result" style={{textAlign: 'center'}}>
                      <h2>{results.incorrect}</h2>
                      <h4 style={{}}>Incorrect</h4>
                    </div>
                    <div className="show-result" style={{textAlign: 'center'}}>
                      <h2>{results.unAttempted}</h2>
                      <h4 style={{}}>Unattempted</h4>
                    </div>
                    
                </div>
                <div className="submit-btns">
                  <button onClick={()=>window.location.reload()}>Restart</button>
                  <Link to='/'><button>Home</button></Link>
                </div>
            </div>
            
        ) : (
            <div className="counter" style={{textAlign: "center"}}>
                <h1>{counter}</h1>
                <h3>Please Wait...</h3>
            </div>
        )
      }
      
    </div>
  );
};

export default Success;
