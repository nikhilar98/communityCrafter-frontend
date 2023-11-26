import { Circle, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"
import { useNavigate } from 'react-router-dom';
export default function Map(props){ 

    const {requirements,teacherLocation,categories} = props
    const navigate = useNavigate()

    console.log('teacherLocation',teacherLocation)
    console.log('categories',categories)
    console.log('requirements',requirements)
    // const LeafIcon = L.Icon.extend({
    //     options: {}
    //   });
    // const greenIcon = new LeafIcon({
    //     iconUrl:
    //       "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF"
    //   });
    return (
        <div>
           <MapContainer center={teacherLocation} zoom={11} scrollWheelZoom={true} style={{ height: "500px", width: '80%',marginLeft:'40px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
             <Circle
                center={teacherLocation}
                pathOptions={{ fillColor: 'green' }}
                radius={500}
            />
            <Marker position={teacherLocation}><Tooltip>Your address</Tooltip></Marker>
            {
                requirements.map(ele => { 
                    return <Marker position={ele.address.location.coordinates.reverse()} key={ele._id} eventHandlers={{
                        click: () => {
                            navigate(`/requirement/${ele._id}`)
                        },
                      }}>
                        <Tooltip>Title:{ele.title}<br/>
                        Category:{categories.find(cat=>cat._id==ele.categoryId)?.name}<br/>
                        duration: {ele.duration}<br/>
                        <strong>Click for more details</strong>
                        </Tooltip>
                    </Marker>
                })
            }
            </MapContainer>
        </div>
    )
}