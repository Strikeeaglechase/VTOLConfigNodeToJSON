import fs from "fs";

const filter = "\t\r";
const vtsData = fs.readFileSync("../input.vts", "ascii")
	.split("")
	.filter(c => !filter.includes(c))
	.join("")
	.split("\n");

const nodeData = JSON.parse(fs.readFileSync("../input.json", "ascii"));

function reader<T>(data: T[]): [() => T, () => boolean] {
	let head = 0;
	function read() {
		return data[head++];
	}
	function eof() {
		return head == data.length;
	}
	return [read, eof];
}

function vector(input: string) {
	const values = input.substring(1, input.length - 1).split(", ");
	return {
		x: parseFloat(values[0]),
		y: parseFloat(values[1]),
		z: parseFloat(values[2])
	};
}
function isVector(v: any): v is { x: number, y: number, z: number; } {
	return (v as { x: number; }).x != undefined;
}

function parseValue(input: string): Value {
	if (input === "True") return true;
	if (input === "False") return false;
	if (input === "null") return null;
	if (input === "") return "";
	if (!isNaN(parseFloat(input))) return parseFloat(input);
	if (input[0] == "(") return vector(input);
	if (input.includes(";") && !isNaN(parseFloat(input.split(";")[0]))) return input.split(";").map(v => parseFloat(v));
	if (input.includes(";")) return input.split(";");
	return input;
}
function saveValue(input: Value): string {
	if (input === true) return "True";
	if (input === false) return "False";
	if (input === null) return "null";
	if (input === "") return "";
	if (Array.isArray(input)) return input.join(";");
	if (isVector(input)) return `(${input.x},${input.y},${input.z})`;
	return input.toString();
}

type Value = string | number | boolean | string[] | {
	x: number;
	y: number;
	z: number;
} | number[];

interface Node {
	name: string;
	values: Record<string, Value>;
	nodes: Node[];
}

const [read, eof] = reader(vtsData);
function _parse(name: string): Node {
	read(); // Skip opening {
	const values: Record<string, Value> = {};
	const nodes: Node[] = [];
	let isArr = true;
	while (!eof()) {
		const next = read();
		if (next == "}") {
			return { name, nodes, values };
		}
		if (next.includes("=")) {
			isArr = false;
			const name = next.substring(0, next.indexOf(" ="));
			const value = parseValue(next.substring(next.indexOf("= ") + 2));
			values[name] = value;
		} else {
			nodes.push(_parse(next));
		}
	}

}

function parse() {
	return _parse(read());
}
function save(node: Node, dpth = 0): string {
	let text = "";
	text += node.name + "\n" + "\t".repeat(dpth) + "{\n";
	Object.keys(node.values).forEach(key => {
		text += "\t".repeat(dpth + 1) + key + " = " + saveValue(node.values[key]) + "\n";
	});
	node.nodes.forEach(subnode => {
		text += "\t".repeat(dpth + 1) + save(subnode, dpth + 1);
	});
	return text + "\t".repeat(dpth) + "}\n";
}


fs.writeFileSync("../output.json", JSON.stringify(parse()));
fs.writeFileSync("../output.vts", save(nodeData));