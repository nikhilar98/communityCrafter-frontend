import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

var items = [
    {  
        imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/21562.jpg",
        name: "image1",
        description: "image1"
    },
    {  
        imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/3726410.jpg",
        name: "image2",
        description: "image2"
    },
    {  
       imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/5454.jpg",
       name: "image3",
       description: "image3"
   }, {  
       imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/bius_x5ia_210111.jpg",
       name: "image4",
       description: "image4"
   },
   {  
       imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/Building.jpg",
       name: "image5",
       description: "image5"
   },
   {  
       imgUrl:"https://porfolio-project-images.s3.ap-south-1.amazonaws.com/carouselImages/excited-kids-sitting-together-grass-park-looking-away-holding-pinwheel-watching-performance-kids-party-entertainment-concept.jpg",
       name: "image6",
       description: "image6"
   }
]

function Item(props)
{
    return (
        <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <img src={props.item.imgUrl} alt={props.item.name} style={{width:'auto',height:'600px'}}/>
        </Paper>
    )
}
export default function CarouselContainer(props)
 {
 
     return (
         <Carousel animation="slide" interval='4000' sx={{width:'1200px',padding:0}}>
             {
                 items.map( (item, i) => <Item key={i} item={item} /> )
             }
         </Carousel>
     )
 }

