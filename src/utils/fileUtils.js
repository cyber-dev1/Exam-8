import fs from "fs";
import path from "path";

const readJSON = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "db", filename), "utf8"));
};

const writeJSON = (filename, data) => {
    fs.writeFileSync(path.join(process.cwd(), "db", filename), JSON.stringify(data, null, 4), "utf8");
};

export { readJSON, writeJSON };
