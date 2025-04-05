import { readJSON, writeJSON } from "../utils/fileUtils.js";
import {formatDate} from "../utils/formatDate.js";
import { verifyToken } from "../utils/tokenUtils.js";
import Joi from "joi";

let TOKEN_KEY = process.env.TOKEN_KEY;

const checkToken = (token) => {
    if (!token) {
        return { error: "Token kerak", status: 401 };
    }

    let decoded;
    try {
        decoded = verifyToken(token, TOKEN_KEY);
        return { decoded };
    } catch (error) {
        return { error: "Token yaroqsiz", status: 403 };
    }
};


const checkIfemployeExists = (employes, phone, email, excludeId = null) => {
    return employes.find(employe =>
        (employe.phone === phone || employe.email === email) && employe.id !== excludeId
    );
};


const employeSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().pattern(/^\+998(88|90|93|91|96|94|44|71|77|98)\d{7}$/).message("Phone number xato to'g'irla").required(),
    email: Joi.string().email().pattern(/@(gmail\.com|mail\.com)$/).message("Email xatoku to'g'irla !").required(),
    password: Joi.string().min(6).max(15).message("Password is invalid at 6 =< password <= 15").required()
});

const getemployes = (req, res) => {
    const employes = readJSON("employes.json");
    res.json({ message: "Employes successfully keldi !!", status: 200, data: employes });
};

const createemploye = (req, res) => {
    const token = req.headers.token;

    const { error, decoded } = checkToken(token);
    if (error) {
        return res.status(error.status || 400).json({ message: error, status: error.status || 400 }); // status kodini aniqlash
    }

    if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Siz admin emassiz, ruxsat yo'q", status: 403 });
    }

    const { error: validationError } = employeSchema.validate(req.body);
    if (validationError) return res.status(400).json({ message: validationError.details[0].message, status: 400 });

    const employes = readJSON("employes.json");
    const existingemploye = checkIfemployeExists(employes, req.body.phone, req.body.email);
    if (existingemploye) {
        return res.status(409).json({ message: "Employe already exists", status: 409 });
    }

    const lastemploye = employes[employes.length - 1];
    const newId = lastemploye ? lastemploye.id + 1 : 1;
    const newemploye = { id: newId, ...req.body, createdAt: formatDate(new Date()) };

    employes.push(newemploye);
    writeJSON("employes.json", employes);
    res.status(201).json({ message: "Employe added successfully", status: 201, data: newemploye });
};

const editemploye = (req, res) => {
    const { error } = employeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });

    const token = req.headers.token;

    const { error: tokenError, decoded } = checkToken(token);
    if (tokenError) {
        return res.status(tokenError.status || 400).json({ message: tokenError, status: tokenError.status || 400 });
    }

    const employes = readJSON("employes.json");
    const index = employes.findIndex(employe => employe.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Employe not found", status: 404 });

    if (decoded.id !== req.params.id) {
        return res.status(403).json({ message: "Siz bu employe emassiz, ruxsat yo'q", status: 403 });
    }

    const existingemploye = checkIfemployeExists(employes, req.body.phone, req.body.email, req.params.id);
    if (existingemploye) {
        return res.status(409).json({ message: "Employe already exists", status: 409 });
    }

    employes[index] = { ...employes[index], ...req.body, updatedAt: formatDate(new Date()) };
    writeJSON("employes.json", employes);
    res.json({ message: "Employe updated successfully", status: 200, data: employes[index] });
};

const deleteemploye = (req, res) => {
    const token = req.headers.token;

    const { error, decoded } = checkToken(token);
    if (error) {
        return res.status(error.status || 400).json({ message: error, status: error.status || 400 });
    }

    if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Siz admin emassiz, ruxsat yo'q", status: 403 });
    }

    let employes = readJSON("employes.json");
    const index = employes.findIndex(employe => employe.id == req.params.id);

    if (index === -1) return res.status(404).json({ message: "Employe not found", status: 404 });

    employes.splice(index, 1);
    writeJSON("employes.json", employes);
    res.json({ message: "Employe muvaffaqiyatli o'chirildi", status: 200 });
};

export { getemployes, createemploye, editemploye, deleteemploye };


