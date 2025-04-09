import { readJSON, writeJSON } from "../utils/fileUtils.js";
import { formatDate } from "../utils/formatDate.js";
import { verifyToken } from "../utils/tokenUtils.js";
import Joi from "joi";

let TOKEN_KEY = process.env.TOKEN_KEY;

const checkToken = (token) => {
    if (!token) {
        return { error: "Token majburiy", status: 401 };
    }

    let decoded;
    try {
        decoded = verifyToken(token, TOKEN_KEY);
        return { decoded };
    } catch (error) {
        return { error: "Token yaroqsiz yoki xato", status: 403 };
    }
};


const checkIfemployeExists = (employes, phone, email, excludeId = null) => {
    return employes.find(employe =>
        (employe.phone === phone || employe.email === email) && employe.id !== excludeId
    );
};


const employeSchema = Joi.object({
    username: Joi.string().min(3).max(30),
    phone: Joi.string().pattern(/^\+998(88|90|93|91|96|94|44|71|99|98|77)\d{7}$/).message("Phone number xato to'g'irla"),
    email: Joi.string().email().pattern(/@(gmail\.com|mail\.com)$/).message("Email xatoku to'g'irla !"),
    password: Joi.string().min(6).max(15).message("Password is invalid at 6 =< password <= 15")
});

const getemployes = (req, res) => {
    const employes = readJSON("employes.json");
    res.json({ message: "Employes muvaffaqiyatli keldi !!", status: 200, data: employes });
};


const getemployeById = (req, res) => {
        let employes = readJSON("employes.json");
        const employeId = parseInt(req.params.id);
        const employe = employes.find(c => c.id === employeId);

        if (!employe) {
            return res.status(404).json({ message: "employe not found", status: 404 });
        }

        res.status(200).json({
            message: "employe successfully keldi !!",
            status: 200,
            data: employe,
        });
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

    const employes = readJSON("employes.json");
    const index = employes.findIndex(employe => employe.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Employe not found", status: 404 });

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

export { getemployes, createemploye, editemploye, deleteemploye, getemployeById };


