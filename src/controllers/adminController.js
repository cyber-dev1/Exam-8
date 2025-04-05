import { readJSON, writeJSON } from "../utils/fileUtils.js";
import {formatDate} from "../utils/formatDate.js";
import {verifyToken} from "../utils/tokenUtils.js"

let TOKEN_KEY = process.env.TOKEN_KEY;

const checkIfadminExists = (admins, email, password, excludeId = null) => {
    return admins.find(admin => 
        (admin.email === email || admin.password === password) && admin.id !== excludeId
    );
};

const getadmins = (req, res) => {
    const admins = readJSON("admin.json");
    res.json({ message: "admins successfully keldi !!", status: 200, data: admins });
};

const editadmin = (req, res) => {
    const token = req.headers.token; 
    const id = parseInt(req.params.id); 

    if (!token) {
        return res.status(401).json({ message: "Token kerak", status: 401 });
    }

    let decoded;
    try {
        decoded = verifyToken(token, TOKEN_KEY); 
    } catch (error) {
        return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
    }

    const admins = readJSON("admin.json");
    const index = admins.findIndex(admin => admin.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Admin topilmadi", status: 404 });
    }

    if (decoded.id !== id) {  
        return res.status(403).json({ message: "Siz bu admin emassiz, ruxsat yo'q", status: 403 });
    }

    const existingadmin = checkIfadminExists(admins, req.body.email, req.body.password, id);
    if (existingadmin) {
        return res.status(409).json({ message: "Bunday admin allaqachon mavjud", status: 409 });
    }

    admins[index] = { ...admins[index], ...req.body, updatedAt: formatDate(new Date()) };
    writeJSON("admin.json", admins);

    res.json({ message: "Admin muvaffaqiyatli yangilandi", status: 200, data: admins[index] });
};

export { getadmins, editadmin };


