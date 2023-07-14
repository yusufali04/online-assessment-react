import { useEffect, useState } from "react";

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
                
                <h4 style={{textAlign: "center", margin: "1rem 0"}}>Correct: {results.correct}</h4>
                <div style={{width: "50%", display: "flex", justifyContent: "space-between", margin: "auto"}}>
                    <h4>Incorrect: {results.incorrect}</h4>
                    <h4>Unattempted: {results.unAttempted}</h4>
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
