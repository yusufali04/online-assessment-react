import { useContext, useEffect } from "react"
import Navbar from "../components/Navbar"
import axios from "axios"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-hot-toast"
import userContext from "../userContext"
import Cookies from 'universal-cookie'

const Dashboard = ()=>{

    const {quizId} = useParams()
    const [results, setResults] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [filter, setFilter] = useState('all')
    const {setUser} = useContext(userContext)
    const cookies = new Cookies()
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/results/${quizId}`, { withCredentials: true })
        .then(res=> {
            setResults(res.data.results)
            setQuiz(res.data.quiz)
        })
        .catch(err=>{
          if(err.response.status === 401) {
            cookies.remove('user')
            setUser(null)
            navigate('/login')
          }
          else {
              console.log(err.response.data)
              toast.error('Something went wrong')
          };
        })
    }, [])

    const handleSelectOption = (event)=>{
        setFilter(event.target.value);
    }

    return (
        <>
            <div className="dashboard-wrap">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                    <div>
                        <h3 style={{marginBottom: '0.5rem'}}>Assessment Title : {quiz? quiz.title : ''}</h3>
                        <p>Qualifying Marks: {quiz? quiz.qualifyMarks : ''}</p>
                    </div>
                    <div className="select-container">
                        <select value={filter} onChange={(e)=>handleSelectOption(e)}>
                            <option value="all">Show All</option>
                            <option value="qualified">Qualified</option>
                            <option value="unqualified">Unqualified</option>
                        </select>
                    </div>
                </div>
                
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th>unAttempted</th>
                            <th>Total Marks</th>
                            <th>Qualified</th>
                        </tr>
                    </thead>
                    <tbody>
  {results
    ? results
        .filter((result) => {
          if (filter === 'all') {
            return true; // Show all results
          } else if (filter === 'qualified') {
            return result.shortlisted; // Show qualified results
          } else if (filter === 'unqualified') {
            return !result.shortlisted; // Show unqualified results
          } else {
            return false; // Invalid filter value, don't show any results
          }
        })
        .map((result) => (
          <tr key={result._id}>
            <td>{result.date}</td>
            <td>{result.username}</td>
            <td>{result.email}</td>
            <td>{result.correct}</td>
            <td>{result.inCorrect}</td>
            <td>{result.unAttempted}</td>
            <td>{result.totalMarks}</td>
            {result.shortlisted ? (
              <td style={{ color: 'green' }}>Yes</td>
            ) : (
              <td style={{ color: 'red' }}>No</td>
            )}
          </tr>
        ))
    : ''}
</tbody>

                </table>
            </div>
        </>
        
    )
}

export default Dashboard