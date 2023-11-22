import { useEffect } from "react"
import { useSelector } from "react-redux"
import {isEmpty} from 'lodash'
import { Button, Card, CardContent, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function TutorClassesList() { 

    const classes = useSelector((state)=>{
      return state.teacherClasses
    })
    const categories = useSelector((state)=>{
      return state.categories
    })

    const navigate = useNavigate()

    console.log(classes)

    return ( 
        <div>
           { 
             isEmpty(classes) ? <p>You have no active classes</p> : 
              <div>
             { 
                classes.map(ele=>{

                  return <Card variant="outlined" sx={{ maxWidth: 800,m: 1.5,backgroundColor:'rgb(242, 243, 243)' }} key={ele._id}>
                  <CardContent>
                     
                      <Typography variant="h4" color="text.secondary" gutterBottom>
                          {ele.title}
                      </Typography>
                      
                      <Typography sx={{ mb: 1.5 }}>
                         Category : {categories.find(cat=>cat._id==ele.categoryId)?.name} 
                      </Typography>
                      <Typography sx={{ mb: 1.5 }}>
                          duration : {ele.duration} months
                      </Typography>
                      <Button onClick={()=>{navigate(`/classes/${ele._id}`)}}>View more Details</Button>
                  </CardContent>
              </Card>
                })
             }
              </div>
           }
        </div>
    )
}

