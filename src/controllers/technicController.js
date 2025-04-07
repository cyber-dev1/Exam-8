import {readJSON, writeJSON} from "../utils/fileUtils.js" 
import {verifyToken} from "../utils/tokenUtils.js";

const JWT_SECRET = process.env.TOKEN_KEY;

export const getTechnics = (req, res) => {
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

    let readTechnics = readJSON("technics.json");
    res.status(200).json(readTechnics);

  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};

export const getTechnicById = (req, res) => {
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

    let readTechnics = readJSON("technics.json");
    let technic = readTechnics.find(tech => tech.id === parseInt(req.params.id));

    if (!technic) {
      return res.status(404).json({ message: "Technic not found", status: 404 });
    }

    let result = {
      id: technic.id,
      name: technic.name,
    };

    res.status(200).json(result);

  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};
