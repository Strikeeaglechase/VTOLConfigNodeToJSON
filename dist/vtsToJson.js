import { VTNode } from "./vtNode.js";
function parseVTValue(value) {
    if (value.length == 0)
        return undefined;
    if (value == "null")
        return null;
    if (value == "True")
        return true;
    if (value == "False")
        return false;
    if (/^[-\d.E]+$/.test(value))
        return parseFloat(value);
    if (/^\([-\d.E]+, [-\d.E]+, [-\d.E]+\)$/g.test(value)) {
        const [x, y, z] = value
            .replace("(", "")
            .replace(")", "")
            .split(", ")
            .map(parseFloat);
        return { x, y, z };
    }
    if (value.includes(";")) {
        return value.split(";").map(parseVTValue).slice(0, -1);
    }
    return value;
}
function processValueLine(line) {
    const eqIdx = line.indexOf("=");
    const key = line.slice(0, eqIdx);
    const value = line.slice(eqIdx + 1);
    return {
        key: key.trim(),
        value: parseVTValue(value.trim()),
    };
}
function vtsToJson(content) {
    const cleaned = content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    let idx = 0;
    const readLine = () => cleaned[idx++];
    const peakLine = () => cleaned[idx];
    const eof = () => idx >= cleaned.length;
    function readNode() {
        const node = new VTNode(readLine());
        readLine();
        while (!eof() && peakLine().includes("=")) {
            const { key, value } = processValueLine(readLine());
            node.values[key] = value;
        }
        while (!eof() && !peakLine().startsWith("}")) {
            node.addChild(readNode());
        }
        const r = readLine();
        return node;
    }
    return readNode();
}
export { vtsToJson };
