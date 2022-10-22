import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private mine = 'Mine';
  public boardArray: Cell[][] = [];
  public alert = false;
  public content = '';

  ngOnInit(): void {
    this.createBoard(10, 10 );
    this.setCounter();
  }

  public restart() {
    this.boardArray = [];
    this.alert = false;
    this.ngOnInit();
  }

  cellClick(x: number, y: number) {
    const cell = this.boardArray[y][x];
    if (cell.isShow) {
      return;
    } else if (cell.value === this.mine) {
      cell.isShow = this.alert = true;
      this.content = 'Game Over';
      this.boardArray.forEach(line => line.forEach(cell => cell.isShow = true));
      return;
    } else if (cell.value !== '') {
      cell.isShow = true;
    } else {
      cell.isShow = true;
      this.getCellsAround(y, x).forEach(cellLocation => {
        this.cellClick(cellLocation.x, cellLocation.y);
      });

    }
    const isEmptyCell = this.boardArray.some(line=> line.some(c=>!c.isShow && c.value !== this.mine));
    if(!isEmptyCell){
      this.alert = true;
      this.content = 'Win';
    }

  }

  setCounter() {
    const size = this.boardArray.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (this.boardArray[y][x].value === this.mine) {
          continue;
        }
        const cellsAroundMine = this.getCellsAround(y, x).map(cellLocation => {
          return this.boardArray[cellLocation.y][cellLocation.x];
        }).filter(cell => cell.value === this.mine).length;
        this.boardArray[y][x].value = cellsAroundMine > 0 ? cellsAroundMine.toString() : '';
      }
    }
  }

  getCellsAround(y: number, x: number) {
    const size = this.boardArray.length - 1;
    const cellsAround: { y: number, x: number }[] = [];
    if (x !== 0 && y !== 0) {
      cellsAround.push({x: x - 1, y: y - 1});
    }
    if (y !== 0) {
      cellsAround.push({x: x, y: y - 1});
    }
    if (y !== 0 && x < size) {
      cellsAround.push({x: x + 1, y: y - 1});
    }
    if (x !== 0) {
      cellsAround.push({x: x - 1, y: y});
    }
    if (x < size) {
      cellsAround.push({x: x + 1, y: y});
    }
    if (x !== 0 && y < size) {
      cellsAround.push({x: x - 1, y: y + 1});
    }
    if (y < size) {
      cellsAround.push({x: x, y: y + 1});
    }
    if (x < size && y < size) {
      cellsAround.push({x: x + 1, y: y + 1});
    }
    return cellsAround;
  }

  createBoard(size: number, numberOfMine: number) {
    const array: Cell[] = [];
    for (let i = 0; i < size * size; i++) {
      array.push({value: '', isShow: false});
    }
    this.setMineLocation(size, numberOfMine, array);
    for (let i = 0; i < size; i++) {
      this.boardArray.push(array.slice(i * size, i * size + size));
    }
  }

  setMineLocation(size: number, numberOfMine: number, array: Cell[]) {
    const mineLocations: number[] = [];
    for (let i = 0; i < numberOfMine; i++) {
      mineLocations.push(this.getRandomNumber(size, mineLocations));
    }
    mineLocations.forEach(n => {
      array[n].value = this.mine;
    });
  }

  getRandomNumber(size: number, mineLocations: number[]): number {
    let number = Math.floor(Math.random() * size * size);
    if (mineLocations.find(n => n === number)) {
      return this.getRandomNumber(size, mineLocations);
    } else {
      return number;
    }
  }
}

interface Cell {
  value: string;
  isShow: boolean;
}
