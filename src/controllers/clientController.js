import { readJSON, writeJSON } from "../utils/fileUtils.js";
import {formatDate} from "../utils/formatDate.js";
import Joi from "joi";

const clientSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().pattern(/^\+998(88|90|93|91|96|94|44|71|77|98)\d{7}$/).message("Phone number xato to'g'irla").required(),
    email: Joi.string().email().pattern(/@(gmail\.com|mail\.com)$/).message("Email xatoku to'g'irla !").required(),
    password : Joi.string().min(6).max(15).required()
});

const checkIfClientExists = (clients, phone, email) => {
    return clients.find(client => client.phone === phone || client.email === email);
};

export const getClients = (req, res) => {
    res.json({ message: "Clients successfully keldi !!", status: 200, data: readJSON("clients.json") });
};

export const createClient = (req, res) => {
    const { error } = clientSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });

    const clients = readJSON("clients.json");
    const existingClient = checkIfClientExists(clients, req.body.phone, req.body.email);
    if (existingClient) {
        return res.status(409).json({ message: "Client already exists", status: 409 });
    }

    const lastClient = clients[clients.length - 1];
    const newId = lastClient ? lastClient.id + 1 : 1;
    const newClient = { id: newId, ...req.body, createdAt: formatDate(new Date()) };

    clients.push(newClient);
    writeJSON("clients.json", clients);
    res.status(201).json({ message: "Client added successfully", status: 201, data: newClient });
};

export const editClient = (req, res) => {
    const { error } = clientSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });

    const clients = readJSON("clients.json");
    const index = clients.findIndex(client => client.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Client not found", status: 404 });

    const existingClient = checkIfClientExists(clients, req.body.phone, req.body.email);
    if (existingClient && existingClient.id !== req.params.id) {
        return res.status(409).json({ message: "Client already exists", status: 409 });
    }

    clients[index] = { ...clients[index], ...req.body, updatedAt: formatDate(new Date()) };
    writeJSON("clients.json", clients);
    res.json({ message: "Client updated successfully", status: 200, data: clients[index] });
};

export const deleteClient = (req, res) => {
    let clients = readJSON("clients.json");
    const index = clients.findIndex(client => client.id == req.params.id);

    if (index === -1) return res.status(404).json({ message: "Client not found", status: 404 });

    clients.splice(index, 1);
    writeJSON("clients.json", clients);
    res.json({ message: "Client deleted successfully", status: 200 });
};
