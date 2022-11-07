let spreadsheetContainer = document.querySelector('#spreadsheet-container')
let exportBtn  = document.querySelector('#export-btn')
let cellIndex = document.querySelector('#cell-index')
let cellText = document.querySelector('#cell-text')
let saveFile = document.querySelector('#save-file')
let boldBtn = document.querySelector('#boldBtn').addEventListener('click', ()=>{
    console.log(boldflag)
    boldflag = !boldflag;

})

let selectColor = document.querySelector('#selectColor')
selectColor.addEventListener('change', function(){
    console.log(typeof  selectColor.value)
    console.log(selectedRow,selectedCol)

    cellEl = getElFromRowCell(selectedRow, selectedCol) 
    console.log(cellEl)
    cellEl.style.backgroundColor = selectColor.value 
})

boldflag=false
const ROW = 10;
const COLS = 10;
let saveFileName="";
let selectedRow;
let selectedCol;
const letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
class Cell {
    constructor(isHeader, disabled, data, row, coloumn, active=false, rowName, colName){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.coloumn = coloumn;
        this.active = active;
        this.rowName = rowName;
        this.colName = colName;
    }
}
let spreadsheet = [];

function innit(){
    for (let i=0;i<ROW;i++){
        let spreadsheetRow = []
        for (let j =0;j<COLS;j++){
            let cellData = '';
            let isHeader = false;
            let active = false;
            let disabled = false;
            if (i === 0){
              cellData = letterArr[j-1]
              isHeader = true
              active = true;
              disabled = true;
            }

            if (j=== 0){
                cellData = i
                isHeader = true
                active = true;
                disabled = true;
            }

            if(!cellData){
                cellData = ''
            }
            let rowName = i
            let colName = letterArr[j-1]
            spreadsheetRow.push(new Cell(isHeader,disabled, cellData, i, j, active, rowName, colName))
        }
        spreadsheet.push(spreadsheetRow)
    }
    drawSheet()
    console.log(spreadsheet)
}

function drawSheet(){
    spreadsheetContainer.innerHTML = ""
   for (let i=0;i<spreadsheet.length;i++){
    const rowContainerEl = document.createElement('div');
    rowContainerEl.className = 'cell-row'
    for (let j=0;j<spreadsheet[i].length; j++){
            let cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEll(cell))
    }
    spreadsheetContainer.append(rowContainerEl)
   }
}

function removeActiveHeader(){
    for (let i=0;i<spreadsheet.length;i++){
        for (let j=0;j<spreadsheet[i].length; j++){
            if (spreadsheet[i][j].isHeader)
             getElFromRowCell(i,j).classList.remove('active-header')
        }
       }
}
exportBtn.addEventListener('click',function(){
    let csv = ""
    for (let i=0;i<spreadsheet.length; i++){
         csv += spreadsheet[i].map(cell=>cell.isHeader? '' : cell.data).join(",")+"\r\n"
    }
    const csvObj = new Blob([csv]);
    const csvURL = URL.createObjectURL(csvObj)
    console.log(csvURL)
    const a = document.createElement('a');
    a.href = csvURL
    a.download = saveFileName || 'Exported Spreadsheet.csv'
    a.click();
})

saveFile.addEventListener('input',function(e){
    saveFile.value = e.target.value 
    saveFileName = e.target.value+'.csv'
})

function getElFromRowCell(row,col){
    return document.querySelector('#cell_'+row+col)
}

function createCellEll(cell){
   const cellEl = document.createElement('input')
   cellEl.className = 'cell'
   cellEl.id = 'cell_'+cell.row+cell.coloumn
   cellEl.disabled = cell.disabled
   cellEl.value = cell.data
   if (cell.isHeader){
    cellEl.classList.add('header')
   }
   
   cellEl.addEventListener('click',()=>handleClickedCell(cell))
   cellEl.addEventListener('input',(e)=>handleCellChange(e,cell))
   return cellEl
}

function handleCellChange(e,cell){
    console.log(cell)
    cell.data = e.target.value
    cellText.textContent = e.target.value
}

function handleClickedCell(cell){
    removeActiveHeader()
    selectedRow = cell.row;
    selectedCol = cell.coloumn;
    if (boldflag)
   {
    cellEl = getElFromRowCell(cell.row, cell.coloumn)
    cellEl.classList.add('bold-txt')
   } 
    cellText.textContent = cell.data || "" 
    console.log(cell)
   let rowHeader = getElFromRowCell(cell.row, 0)
   let colHeader = getElFromRowCell(0,cell.coloumn)
    cellIndex.innerHTML = letterArr[cell.coloumn-1]+cell.row
   rowHeader.classList.add('active-header')
   colHeader.classList.add('active-header')
}
innit();