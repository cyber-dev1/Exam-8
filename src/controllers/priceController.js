import { readJSON } from "../utils/fileUtils.js";
import { verifyToken } from "../utils/tokenUtils.js";

const JWT_SECRET = process.env.TOKEN_KEY;

export const getprices = (req, res) => {
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

    let readprices = readJSON("prices.json");
    let readTechnics = readJSON("technics.json");

    const pricesWithTechnics = readprices.map((price) => {
      const technic = readTechnics.find(tech => tech.id === price.techId);
      return {
        id: price.id,
        price: price.price,
        technicName: technic ? technic.name : "Noma'lum"
      };
    });
    
    res.status(200).json({
      message: "Prices successfully keldi !!",
      status: 200,
      data: pricesWithTechnics
    });

  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};

export const getpriceById = (req, res) => {
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

    let readprices = readJSON("prices.json");
    let readTechnics = readJSON("technics.json");

    let price = readprices.find((tech) => tech.id === parseInt(req.params.id));

    if (!price) {
      return res.status(404).json({ message: "Price not found", status: 404 });
    }

    const technic = readTechnics.find((tech) => tech.id === price.techId);

    let result = {
      id: price.id,
      price: price.price,
      technicName: technic ? technic.name : "Noma'lum"
    };

    res.status(200).json({
      message: "Price successfully found",
      status: 200,
      data: result
    });

  } catch (error) {
    return res.status(403).json({ message: "Token yaroqsiz", status: 403 });
  }
};