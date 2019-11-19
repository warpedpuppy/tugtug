import axios from 'axios';
import SiteConfig from '../../config';
import MazeServices from '../../services/maze-service';
export default function () {
  return {
  	getDatabaseData: function () {
        return MazeServices.getOneMaze(18);
    }
  }
}