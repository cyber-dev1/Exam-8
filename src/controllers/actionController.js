import { readJSON, writeJSON } from "../utils/fileUtils.js";
import { actionDate, formatDate } from "../utils/formatDate.js";
import { verifyToken } from "../utils/tokenUtils.js"

const JWT_SECRET = process.env.TOKEN_KEY

const checkIfadminExists = (actions, username, phone, email, password, excludeId = null) => {
  return actions.find(action =>
    (action.email === email || action.password === password  || action.username === username  || action.phone === phone) && action.id !== excludeId
  );
};

const getactions = (req, res) => {
  res.json({
    message: "actions successfully keldi !!",
    status: 200,
    data: readJSON("actions.json"),
  });
};

const createaction = (req, res) => {
  const token = req.headers.token;
  const id = parseInt(req.params.id);

  if (!token) {
    return res.status(401).json({ message: "Token kerak", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
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

  const existingadmin = checkIfadminExists(actions, req.body.username, req.body.email, req.body.password, req.body.phone, req.body.password, id);
  if (existingadmin) {
    return res.status(409).json({ message: "Bunday action allaqachon mavjud", status: 409 });
  }

  const { username, phone, email, password, techId, employeId } = req.body;

  let existingClient = clients.find(
    (client) => client.phone === phone  || client.email === email
  );

  let clientId;

  if (!existingClient) {
    const lastClient = clients[clients.length - 1];
    const newClientId = lastClient ? lastClient.id + 1 : 1;

    const newUser = {
      id: newClientId,
      username,
      email,
      password,
      phone,
      createdAt: formatDate(new Date()),
    };

    clients.push(newUser);
    writeJSON("clients.json", clients);
    clientId = newClientId;
  } else {
    clientId = existingClient.id;
  }

  const alreadyActioned = actions.some((action) => action.clientId === clientId);
  if (alreadyActioned) {
    return res
      .status(409)
      .json({ message: "Client already submitted an action", status: 409 });
  }


  const employeIndex = employes.findIndex((emp) => emp.id === employeId);
  if (employeIndex === -1) {
    return res.status(404).json({ message: "Employe not found", status: 404 });
  }

  if ((employes[employeIndex].accCount ||  0) >= 3) {
    return res
      .status(403)
      .json({ message: "Employe has reached maximum workload", status: 403 });
  }
  const lastAction = actions[actions.length - 1];
  const newActionId = lastAction ? lastAction.id + 1 : 1;

  const findPrice = prices.find((p) => p.techId === techId);
  const totalPrice = findPrice ? findPrice.price : 0;

  const newAction = {
    id: newActionId,
    clientId: clientId,
    employeId: employeId,
    techId: techId,
    date: actionDate(new Date()),
    totalPrice: totalPrice,
    status: 0,
    createdAt: formatDate(new Date()),
  };

  employes[employeIndex].accCount = (employes[employeIndex].accCount || 0) + 1;


  actions.push(newAction);
  writeJSON("actions.json", actions);
  writeJSON("employes.json", employes);

  res.status(201).json({
    message: "action added successfully",
    status: 201,
    data: newAction,
  });
};

const updateActionStatus = (req, res) => {
  const actions = readJSON("actions.json");
  const { id } = req.params;
  const { status } = req.body;

  const actionIndex = actions.findIndex((action) => action.id === parseInt(id));

  if (actionIndex === -1) {
    return res.status(404).json({ message: "Action not found", status: 404 });
  }

  const currentStatus = actions[actionIndex].status;

  if (status < currentStatus) {
    return res.status(400).json({
      message: "New status cannot be less than the current status",
      status: 400,
    });
  }

  if (currentStatus >= 2) {
    return res.status(403).json({
      message: "Status cannot be updated beyond 2",
      status: 403,
    });
  }

  actions[actionIndex].status = status;

  writeJSON("actions.json", actions);

  res.status(200).json({
    message: "Status updated successfully",
    status: 200,
    data: actions[actionIndex],
  });
};

export { getactions, createaction, updateActionStatus };