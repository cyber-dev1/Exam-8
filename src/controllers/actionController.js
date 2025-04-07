
import { readJSON, writeJSON } from "../utils/fileUtils.js";
import { actionDate, formatDate } from "../utils/formatDate.js";
import { verifyToken } from "../utils/tokenUtils.js";

const JWT_SECRET = process.env.TOKEN_KEY;

const getactions = (req, res) => {
  let token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token kerak !", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin get qila oladi", status: 403 });
    }

    let actions = readJSON("actions.json");

    res.status(200).json({
      message: "Actions successfully keldi !!",
      status: 200,
      data: actions,
    });

  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};

const getactionByID = (req, res) => {
  let token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token kerak !", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Faqat admin get qila oladi", status: 403 });
    }

    const actionId = req.params.id ? parseInt(req.params.id) : null;

    let actions = readJSON("actions.json");

    if (actionId) {
      const action = actions.find(action => action.id === actionId);

      if (!action) {
        return res.status(404).json({ message: "Action topilmadi", status: 404 });
      }

      return res.status(200).json({
        message: `Action topildi ${ req.params.id }`,
        status: 200,
        data: action,
      });
  }
  } catch (error) {
  return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
}
};




const createaction = (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token kerak", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Faqat admin create qila oladi", status: 403 });
    }
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }

  const actions = readJSON("actions.json");
  const clients = readJSON("clients.json");
  const employes = readJSON("employes.json");
  const prices = readJSON("prices.json");

  const { username, phone, email, password, techId, employeId } = req.body;

  let existingClient = clients.find(
    (client) => client.phone === phone ||  client.email === email
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

  const alreadyActioned = actions.some(
    (action) => action.clientId === clientId
  );
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
    message: "Action added successfully",
    status: 201,
    data: newAction,
  });
};

const updateActionStatus = (req, res) => {
  const { status } = req.body;
  const actionId = parseInt(req.params.id);
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token kerak", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }

  const actions = readJSON("actions.json");

  const actionIndex = actions.findIndex((action) => action.id === actionId);
  if (actionIndex === -1) {
    return res.status(404).json({ message: "Action not found", status: 404 });
  }

  const action = actions[actionIndex];

  if (decoded.role !== "admin" && decoded.id !== action.employeId) {
    return res.status(403).json({
      message: "Bu employe emas yoki admin emas, ruxsat yo'q",
      status: 403,
    });
  }

  const currentStatus = action.status;

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

const deleteAction = (req, res) => {
  const actionId = parseInt(req.params.id);
  let token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token kerak", status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token, JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }

  let readActions = readJSON("actions.json");
  let clients = readJSON("clients.json");
  let employes = readJSON("employes.json");
  const actions = readActions;

  const actionIndex = actions.findIndex((action) => action.id === actionId);
  if (actionIndex === -1) {
    return res.status(404).json({ message: "Action not found", status: 404 });
  }

  const action = actions[actionIndex];

  if (action.status === 2) {
    const clientIndex = clients.findIndex((client) => client.id === action.clientId);
    if (clientIndex !== -1) {
      const clientHasOtherActions = actions.some((a) => a.clientId === action.clientId);
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
    res.status(400).json({
      message: "Action cannot be deleted unless the status is 2",
      status: 400,
    });
  }
};



export { getactions, createaction, updateActionStatus, deleteAction, getactionByID };