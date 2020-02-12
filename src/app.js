let canvas = document.getElementById("myCanvas");
canvas.width = 800;
canvas.height = 500;

let ctx = canvas.getContext("2d");


const GW = 80; //grid width
const GH = 50; //grid height

const SCALE = 10; //scale between grid & canvas

const TOTAL_DIRECTION = 4;
const DI = [-1, 0, 1, 0]; //direction i  UP RIGHT DOWN LEFT
const DJ = [ 0, 1, 0,-1]; //direction j

const DENSITY = 5;

let grid = null;
let cities = new Array(GW * GH);
let inOpenset = new Array(GW * GH);

let sss = 0;
let ggg = 3999;

function init() {


    grid = new Array(GH);
    for (let i = 0; i < GH; i++ ) {
        grid[i] = new Array(GW);
    }

    for (let i = 0; i < GH; i++) {
        for (let j = 0; j < GW; j++) {

            grid[i][j] = Math.floor(Math.random() * DENSITY); //random 0 to DENSITY - 1 

            //init cities
            cities[i * GW + j] = new City(i, j, grid[i][j]);
        }
    }

    for (let i = 0; i < GW * GH; i++) {
        inOpenset[i] = false;
    }

}

function City(i, j, status) {
    this.i = i;
    this.j = j;
    this.s = status;
    this.neighbor = function() {
        let result = new Array();
        for (let d = 0; d < TOTAL_DIRECTION; d++) {
            let ni = this.i + DI[d];
            let nj = this.j + DJ[d];
            if (ni >= 0 && ni < GH && nj >= 0 && nj < GW) {
                result.push(ni * GW + nj); //id of neighbor city
            }
        }
        return result;
    }
    this.f = Infinity;
    this.g = Infinity;
    this.h = distance(this.id, ggg);
}

function distance(a, b) {
    let ai = Math.floor(a / GW);
    let aj = a % GW;
    let bi = Math.floor(b / GW);
    let bj = b % GW;
    return Math.sqrt((ai - bi) * (ai - bi) + (aj - bj) * (aj -bj));
}

let array_length = null;

function heap_root(input, i) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let max = i;
    if (left < array_length && cities[input[max]].f < cities[input[left]].f) {
        max = left;
    }
    if (right < array_length && cities[input[max]].f < cities[input[right]].f) {
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

function reconstruct_path(cameFrom, current) {
    while (current != sss) {
        let currenti = Math.floor(current / GW);
        let currentj = current % GW;
        grid[currenti][currentj] = -1;
        current = cameFrom[current];
    }
    let sssi = Math.floor(sss / GW);
    let sssj = sss % GW;
    grid[sssi][sssj] = -1;
}

function A_Star(start, goal) {


    let openSet = new Array(); //the array contains cities need to value, be sorted by f score
    openSet.push(start);
    inOpenset[start] = true;

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known
    let cameFrom = new Array(GW * GH);

    cities[start].g = 0;
    cities[start].f = cities[start].h;

    while (openSet.length > 0) {


        let current = openSet.shift();


        if (current === goal) return reconstruct_path(cameFrom, current);

        let neighborOfCurrent = cities[current].neighbor();

        for (let i = 0; i < neighborOfCurrent.length; i++) {


            let neighbor = neighborOfCurrent[i];

            if (cities[neighbor].s !== 1) { // others: available city, 1: unavailable city

                let tentative_g = cities[current].g + 1; //1: cost from current to neighbor if neighbor is an available city
                if (tentative_g < cities[neighbor].g) {

                    cameFrom[neighbor] = current;
                    cities[neighbor].g = tentative_g;
                    cities[neighbor].f = cities[neighbor].g + cities[neighbor].h;

                    if (!inOpenset[neighbor]) {
                        openSet.push(neighbor);
                        inOpenset[neighbor] = true;
                        heapSort(openSet);
                    } 
                }
            }
        }
    }
    return false;
}


function draw() {

    for (let i = 0; i < GH; i++) {
        for (let j = 0; j < GW; j++) {


            if (grid[i][j] === 1) ctx.fillStyle = 'black';
            else if (grid[i][j] === -1) ctx.fillStyle = 'red';
            else ctx.fillStyle = 'white';

            ctx.fillRect(j * SCALE, i * SCALE, SCALE, SCALE);
        }
    }
}

init();

A_Star(sss, ggg);

draw();
