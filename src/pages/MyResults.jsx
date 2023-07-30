import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const MyResults = ()=>{

    const { userId } = useParams()
    const [results, setResults] = useState()
    useEffect(()=>{
        axios.get(`http://localhost:4000/results/${userId}`, { withCredentials: true })
        .then((res)=> {
                // Use reduce to group objects based on quizId
                const groupedArrays = res.data.reduce((acc, current) => {
                    const quizId = current.quizId;
                    if (!acc[quizId]) {
                    acc[quizId] = [];
                    }
                    acc[quizId].push(current);
                    return acc;
                }, {});
                
                // Convert the groupedArrays object to an array of arrays
                const result = Object.values(groupedArrays);
                setResults(result)
                console.log(result);
        })
        .catch((err)=> {
            console.log(err);
            toast.error('Something went wrong')
        })
    }, [])

    return(
        <div className="myresults-wrap">

        {
            results? (
                results.map((quiz, index)=>(
                    <div key={index}>
                    <h3 style={{color: '#49416D'}}>Assessment Title: {quiz[0].quizTitle}</h3>
                        <table className="myresults-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Correct</th>
                                    <th>Incorrect</th>
                                    <th>Unattempted</th>
                                    <th>Total Marks</th>
                                    <th>Qualified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    quiz.map((results)=>(
                                        <tr>
                                            <td>{results.date}</td>
                                            <td>{results.correct}</td>
                                            <td>{results.inCorrect}</td>
                                            <td>{results.unAttempted}</td>
                                            <td>{results.totalMarks}</td>
                                            {results.shortlisted? <td style={{color: 'green'}}>Yes</td> : <td style={{color: 'red'}}>No</td>}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    
                ))
            ) 
            : 
            'Loading...'
        }
            
        </div>
    )

}

export default MyResults