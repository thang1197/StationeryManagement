import "./featured.scss"
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Featured = (props) => {
  return (
    <div className="featured">
        <div className="top">
          <h1 className="title">{props.title}</h1>
          <MoreVertOutlinedIcon fontSize="small"/>
        </div>
        <div className="bottom">
          <div className="featuredChart">
            <CircularProgressbar value={props.rate} text={`${props.rate}%`} strokeWidth={5}/>
          </div>
          <p className="title">Total Cost</p>
          <p className="amount">${props.cost}</p>
        </div>
    </div>
  )
}

export default Featured