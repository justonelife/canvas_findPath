let canvas = document.getElementById("myCanvas");
canvas.width = 800;
canvas.height = 500;

let ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(800, 500);
ctx.stroke();

const GW = 80; //grid width
const GH = 50; //grid height

const TOTAL_DIRECTION = 4;
const DI = [-1, 0, 1, 0]; //direction i  UP RIGHT DOWN LEFT
const DJ = [ 0, 1, 0,-1]; //direction j

let grid = null;
let cities = new Array(GW * GH);

function init() {


    grid = new Array(GH);
    for (let i = 0; i < GH; i++ ) {
        grid[i] = new Array(GW);
    }

    for (let i = 0; i < GH; i++) {
        for (let j = 0; j < GW; j++) {

            grid[i][j] = Math.floor(Math.random() * 2); //random 0, 1

            //init cities
            cities[i * GW + j] = new City(i, j, grid[i][j]);
        }
    }


}

function City(i, j, status) {
    this.i = i;
    this.j = j;
    this.s = status;
    this.id = this.i * GW + this.j;
    this.neighbor = function() {
        let result = new Array();
        for (let d = 0; d < TOTAL_DIRECTION; d++) {
            let ni = this.i + DI[d];
            let nj = this.j + DJ[d];
            if (ni >= 0 && ni <= GH && nj >= 0 && nj <= GW) {
                result.push(ni * GW + nj); //id of neighbor city
            }
        }
        return result;
    }
    this.f = 0;
    this.g = 0;
    this.h = 0;
}

let array_length = null;

function heap_root(input, i) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let max = i;
    if (left < array_length && input[max] < input[left]) {
        max = left;
    }
    if (right < array_length && input[max] < input[right]) {
        max = right;
    }

    if (max != i) {
        swap(input, max, i);
        heap_root(input, max);
    }
}

function swap(input, indexA, indexB) {
    let temp = input[indexA];
    input[indexA] = input[indexB];
    input[indexB] = temp;
}

function heapSort(input) {
    array_length = input.length;
    for (let i = Math.floor(array_length / 2); i >= 0; i--) {
        heap_root(input, i);
    }

    for (let i = input.length - 1; i > 0; i--) {
        swap(input, 0, i);
        array_length--;
        heap_root(input, 0);
    }
}

init();