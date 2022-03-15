import fs from "fs";
const vtsData = fs.readFileSync("../input.vts", "ascii");
const nodeData = JSON.parse(fs.readFileSync("../input.json", "ascii"));
function reader(data) {
    let head = 0;
    function read() {
        return data[head++];
    }
    function eof() {
        return head == data.length;
    }
    return [read, eof];
}
function vector(input) {
    const values = input.substring(1, input.length - 1).split(", ");
    return {
        x: parseFloat(values[0]),
        y: parseFloat(values[1]),
        z: parseFloat(values[2])
    };
}
function isVector(v) {
    return v.x != undefined;
}
const validNumbers = "1234567890.-";
const isNumric = (str) => str.split("").every(c => validNumbers.includes(c));
function parseValue(input) {
    if (input === "True")
        return true;
    if (input === "False")
        return false;
    if (input === "null")
        return null;
    if (input === "")
        return "";
    if (isNumric(input))
        return parseFloat(input);
    if (input[0] == "(")
        return vector(input);
    if (input.includes(";") && !isNumric(input.split(";")[0]))
        return input.split(";").map(v => parseFloat(v));
    if (input.includes(";"))
        return input.split(";");
    return input;
}
function saveValue(input) {
    if (input === true)
        return "True";
    if (input === false)
        return "False";
    if (input === null)
        return "null";
    if (input === "")
        return "";
    if (Array.isArray(input))
        return input.join(";");
    if (isVector(input))
        return `(${input.x},${input.y},${input.z})`;
    return input.toString();
}
function parse(data) {
    const [read, eof] = reader(data.split("\n"));
    function _parse(name) {
        read(); // Skip opening {
        const values = {};
        const nodes = [];
        let isArr = true;
        while (!eof()) {
            const next = read();
            // console.log(`Child - ${next} Parent - ${name}`);
            if (next == "}") {
                // console.log(`Ret: ${name}`);
                return { name, nodes, values };
            }
            if (next.includes("=")) {
                isArr = false;
                const name = next.substring(0, next.indexOf(" ="));
                const value = parseValue(next.substring(next.indexOf("= ") + 2));
                values[name] = value;
            }
            else {
                nodes.push(_parse(next));
            }
        }
    }
    return _parse(read());
}
function save(node, dpth = 0) {
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
// fs.writeFileSync("../output.json", JSON.stringify(parse(vtsData)));
// fs.writeFileSync("../output.vts", save(nodeData));
export { parse, save };
