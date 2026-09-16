const SVG_URL = "http://www.w3.org/2000/svg";
const HTML_URL = "http://www.w3.org/1999/xhtml";

function randomColour() {
	return "#" + Math.floor(Math.random()*0xffffff)
		.toString(16)
		.padStart(6, "0");
}

function calcPerpendicularTranslation(x0, y0, x1, y1) {
	if (y0 == y1) {
		return [0, 1];
	}
	let perpGradient = (x1 - x0)/(y0 - y1);
	let dx = 1 / Math.sqrt(1 + perpGradient ** 2);
	return [dx, perpGradient * dx];
}


function addSVGElement(element, name, attrs, noAppend = false) {
	let el = document.createElementNS(SVG_URL, name);
	if (attrs) {
		for (let [key, value] of Object.entries(attrs)) {
			el.setAttribute(key, value);
		}
	}
	if (!noAppend) {
		element.appendChild(el);
	}
	return el;
}

function editSVGElement(el, attrs) {
	for (let [key, value] of Object.entries(attrs)) {
		el.setAttribute(key, value);
	}
}

function transformCoords(x, y, matrix) {
	const pt = new DOMPointReadOnly(x, y);
	const newPt = pt.matrixTransform(matrix);
	return {x: newPt.x, y: newPt.y};
}

function transformBbox(bbox, matrix) {
	const {x: x0, y: y0} = transformCoords(bbox.x, bbox.y, matrix);
	const {x: x1, y: y1} = transformCoords(bbox.x + bbox.width, bbox.y + bbox.height, matrix);
	return  {
		x: x0,
		y: y0,
		width: x1 - x0,
		height: y1 - y0
	}
}

function getSVGCoords(x, y, element) {
	return transformCoords(x, y, element.getScreenCTM().inverse())
}

function dragging(callback, transformCoords) {
	function onMove(event) {
		let {x, y} = transformCoords(event.x, event.y);
		callback(x, y);
	}
	
	document.addEventListener("pointermove", onMove);
	
	return new Promise((resolve) => {
		function onUp() {
			document.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerup", onUp);
			resolve();
		}
		document.addEventListener("pointerup", onUp)
	})
}

export { addSVGElement, editSVGElement, SVG_URL, HTML_URL, dragging, getSVGCoords, transformCoords, transformBbox, randomColour, calcPerpendicularTranslation };