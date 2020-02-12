let canvas = document.getElementById("myCanvas");
canvas.width = 800;
canvas.height = 500;

let ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(800, 500);
ctx.stroke();




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

