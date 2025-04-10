import { readJSON, writeJSON } from "../utils/fileUtils.js";
import { actionDate, formatDate } from "../utils/formatDate.js";
import { verifyToken } from "../utils/tokenUtils.js";

const JWT_SECRET = process.env.TOKEN_KEY;

const getactionsByClient = (req, res) => {
  let actions = readJSON("actions.json");
  let technics = readJSON("technics.json");

  const enrichedActions = actions.map((action) => {
    const techId = action.techId;
    const tech = technics.find((t) => t.id === techId);
    const techName = tech ? tech.name : "Noma'lum texnologiya";

    return {
      ...action,
      techName,
    };
  });

  res.status(200).json({
    message: "Actions successfully keldi !!",
    status: 200,
    data: enrichedActions,
  });
};

const getactions = (req, res) => {
  let token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Token kerak !", status: 401 });

  try {
    const decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin get qila oladi", status: 403 });
    }

    const actions = readJSON("actions.json");
    res.status(200).json({ message: "Actions successfully keldi !!", status: 200, data: actions });
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};

const getactionByID = (req, res) => {
  let token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Token kerak !", status: 401 });

  try {
    const decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin get qila oladi", status: 403 });
    }

    const actionId = req.params.id ? parseInt(req.params.id) : null;
    const actions = readJSON("actions.json");

    if (actionId) {
      const action = actions.find(action => action.id === actionId);
      if (!action) return res.status(404).json({ message: "Action topilmadi", status: 404 });

      return res.status(200).json({ message: `Action topildi ${req.params.id}`, status: 200, data: action });
    }
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};

const createaction = (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Token kerak", status: 401 });

  try {
    const decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin create qila oladi", status: 403 });
    }
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }

  const actions = readJSON("actions.json");
  const clients = readJSON("clients.json");
  const employes = readJSON("employes.json");
  const prices = readJSON("prices.json");

  const { username, phone, email, password, techId, employeId } = req.body;

  // Clientni tekshiramiz, agar mavjud bo‘lsa, accCount ni oshiramiz
  let client = clients.find(c => c.email === email && c.password === password);
  if (!client) {
    // Agar client mavjud bo‘lmasa, yangi client qo‘shamiz
    const lastClient = clients[clients.length - 1];
    const newClientId = lastClient ? lastClient.id + 1 : 1;
    client = { id: newClientId, username, email, password, phone, createdAt: formatDate(new Date()), accCount: 0 };
    clients.push(client);
    writeJSON("clients.json", clients);
  }

  // Clientning accCount qiymatini tekshiramiz
  const clientActions = actions.filter(action => action.clientId === client.id);
  if (clientActions.length >= 3) {
    return res.status(403).json({ message: "Client maksimal action miqdoriga yetgan (3 ta)", status: 403 });
  }

  // Employe tekshiruvi
  const employe = employes.find(emp => emp.username === employeId);
  if (!employe) return res.status(404).json({ message: "Employe topilmadi", status: 404 });
  if ((employe.accCount || 0) >= 3) return res.status(403).json({ message: "Employe maksimal ish miqdoriga yetgan", status: 403 });

  // Action yaratamiz
  const lastAction = actions[actions.length - 1];
  const newActionId = lastAction ? lastAction.id + 1 : 1;
  const findPrice = prices.find((p) => p.techId === techId);
  const totalPrice = findPrice ? findPrice.price : 0;

  const newAction = {
    id: newActionId,
    clientId: client.id,
    employeId: employe.id,
    techId,
    date: actionDate(new Date()),
    totalPrice,
    status: 0,
    createdAt: formatDate(new Date()),
  };

  const employeIndex = employes.findIndex(emp => emp.id === employe.id);
  employes[employeIndex].accCount = (employes[employeIndex].accCount || 0) + 1;

  actions.push(newAction);
  writeJSON("actions.json", actions);
  writeJSON("employes.json", employes);

  // Clientning accCount ni yangilash
  client.accCount = clientActions.length + 1; // 1 ta yangi action qo'shilganligi sababli

  writeJSON("clients.json", clients);

  res.status(201).json({ message: "Action muvaffaqiyatli qo‘shildi", status: 201, data: newAction });
};

const updateActionStatus = (req, res) => {
  const { status } = req.body;
  const actionId = parseInt(req.params.id);

  const actions = readJSON("actions.json");
  const actionIndex = actions.findIndex((action) => action.id === actionId);
  if (actionIndex === -1) return res.status(404).json({ message: "Action not found", status: 404 });

  const action = actions[actionIndex];

  const currentStatus = action.status;
  if (status < currentStatus) {
    return res.status(400).json({ message: "New status cannot be less than the current status", status: 400 });
  }
  if (currentStatus >= 2) {
    return res.status(403).json({ message: "Status cannot be updated beyond 2", status: 403 });
  }

  actions[actionIndex].status = status;
  writeJSON("actions.json", actions);

  res.status(200).json({ message: "Status updated successfully", status: 200, data: actions[actionIndex] });
};

const deleteAction = (req, res) => {
  const actionId = parseInt(req.params.id);
  const token = req.headers.token;
  if (!token) return res.status(401).json({ message: "Token kerak", status: 401 });

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }

  const actions = readJSON("actions.json");
  const clients = readJSON("clients.json");
  const employes = readJSON("employes.json");

  const actionIndex = actions.findIndex((action) => action.id === actionId);
  if (actionIndex === -1) return res.status(404).json({ message: "Action not found", status: 404 });

  const action = actions[actionIndex];
  if (action.status === 1) {
    const clientIndex = clients.findIndex((client) => client.id === action.clientId);
    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
      writeJSON("clients.json", clients);
    }

    const employeIndex = employes.findIndex((employe) => employe.id === action.employeId);
    if (employeIndex !== -1) {
      employes[employeIndex].accCount = (employes[employeIndex].accCount || 0) - 1;
      writeJSON("employes.json", employes);
    }

    actions.splice(actionIndex, 1);
    writeJSON("actions.json", actions);

    res.status(200).json({
      message: "Action deleted successfully and employe accCount updated",
      status: 200,
      data: { actionId, clientId: action.clientId, employeId: action.employeId },
    });
  } else {
    res.status(400).json({ message: "Action cannot be deleted unless the status is 2", status: 400 });
  }
};

export { getactions, createaction, getactionsByClient, updateActionStatus, deleteAction, getactionByID };
