import axios from 'axios';
import { API_BASE_URL } from '../../config';
export default function () {
  return {
  	getDatabaseData: function () {

           let indexToGet = (this.grid.boards)?this.grid.boards.length:0;
           let next = indexToGet + 1;
           let requestBoardNumber = (indexToGet === 0)?1:next;
           // console.log(`${API_BASE_URL}/api/tugtug/grids`)
           axios
           .post(`${API_BASE_URL}/api/tugtug/grids`, {board: requestBoardNumber})
           .then(response => {
                this.dbData = response.data;
               // console.log('loaded data = ', this.dbData.boards)
                if (indexToGet === 0) {
                    this.grid.boards = [...this.grid.boards, response.data.boards];
                   // console.log(this.grid.boards)
                    this.buildGame();
                 } else {
                    if (response.data.boards) {
                        this.grid.boards = [...this.grid.boards, response.data.boards];
                    }
                    this.grid.addNewBoardData(this.dbData)
                 }
              
            })
            .catch(err => console.error(err));  
        }

  }
}