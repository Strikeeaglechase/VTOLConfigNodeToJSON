function formatNum(n) {
    let str = n.toString();
    str = str.replace("e", "E");
    return str;
}
function writeVtsFile(node) {
    const content = [node.name, "{"];
    for (const [key, value] of Object.entries(node.values)) {
        let result = value;
        if (Array.isArray(value))
            result = value.join(";") + ";";
        else if (value && typeof value === "object")
            result = `(${formatNum(value.x)}, ${formatNum(value.y)}, ${formatNum(value.z)})`;
        if (result === true)
            result = "True";
        if (result === false)
            result = "False";
        if (result === undefined)
            result = "";
        if (typeof result == "number" && result.toString().includes("e"))
            result = formatNum(result);
        content.push(`\t${key} = ${result}`);
    }
    for (const child of node.children) {
        const childContent = writeVtsFile(child).map(l => `\t${l}`);
        content.push(...childContent);
    }
    content.push("}");
    return content;
}
function jsonToVts(node) {
    return writeVtsFile(node).join("\n");
}
export { jsonToVts };
