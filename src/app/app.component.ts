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
    this.createBoard(10, 15);
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
    const isEmptyCell = this.boardArray.some(line => line.some(c => !c.isShow && c.value !== this.mine));
    if (!isEmptyCell) {
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
    const size = this.boardArray.length;
    const cellsAround: { y: number, x: number }[] = [];
    for (let ys = y - 1; ys <= y + 1; ys++) {
      for (let xs = x - 1; xs <= x + 1; xs++) {
        if (xs >= 0 && xs < size && ys >= 0 && ys < size && !(x === xs && y === ys)) {
            cellsAround.push({x: xs, y: ys});
        }
      }
    }
    return cellsAround;
  }

  createBoard(size: number, numberOfMine: number) {
    const array: Cell[] = [];
    for (let i = 0; i < size * size; i++) {
      array.push({value: '', isShow: true});
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
