import fs from "fs";
import { jsonToVts } from "./jsonToVts.js";
import { vtsToJson } from "./vtsToJson.js";
const file = fs.readFileSync("../test.vts", "utf-8");
const node = vtsToJson(file);
const result = jsonToVts(node);
fs.writeFileSync("../_output.vts", result);
