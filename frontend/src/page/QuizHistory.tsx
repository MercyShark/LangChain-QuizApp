import React from 'react'
import { useEffect, useState } from 'react'
import { quizHistory , logout } from '../api/quiz'
import { Box, Button } from '@mui/material';
import { NavLink , useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {GridColDef } from '@mui/x-data-grid';

import DataGridDemo from '../components/DataTable';
function QuizHistory() {
    const [data, setData] = useState<{} | null >(null);
    const {  SignOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/quiz/")
    quizHistory().then((response) => {
      console.log(response)
      setData(response)
    }).catch((error) => {
      console.log(error)
    })},[navigate])

  //   const renderQuestions =
  //   <Box>
  //   <h2>Quiz History</h2>
  //   <Box>{data?.total_quiz}</Box>
  //   {
  //     data?.history.map((item, index : number) => (
  //       <Box key={item._id} display="flex" justifyContent="space-between" alignItems="center">
  //         <Box>{item.quiz}</Box> 
  //         <Box>{item.created_at}</Box>
  //         <Button variant="outlined" component={NavLink} to={`/quiz/${item._id}`}>Show Quiz</Button>
  //       </Box> 
        
  //     )
        

         
  //     )
  //   }
  // </Box>
     
     const columns: GridColDef<(typeof rows)[number]>[] = [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'quiz',
        headerName: 'Quiz Topic',
        width: 150,
        flex : 1
        // editable: true,

      },
      {
        field: 'created_at',
        headerName: 'Date Created',
        width: 150,
        // editable: true,
        flex : 1,

        valueGetter: (value, row) => `${row.created_at}`
      },
      {
        field: "show_quiz",
        headerName: "Show Quiz",
        width: 150,
        flex : 1,

        renderCell: (params) => (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              component={NavLink} to={`/quiz/${params.row._id}`}
              onClick={() => {

                console.log(params);
              }}
            >
              Show Quiz
            </Button>
          </>
        ),
      }
    ];
     
    
  return (
    <Box>
      {/* <Button onClick={SignOut}>Logout user</Button> */}
    {/* <div>QuizHistory</div> */}
    { data && <DataGridDemo columns={columns} rows={data.history}/>}
    </Box>
  )
}

export default QuizHistory