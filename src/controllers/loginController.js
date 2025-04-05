import Joi from "joi";
import { readJSON } from "../utils/fileUtils.js";
import { createToken } from "../utils/tokenUtils.js";

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/@(gmail\.com|mail\.com)$/)
    .email()
    .message("Xato email tog'irla")
    .required(),
  password: Joi.string().min(6).max(15).required(),
});

export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const userAgent = req.headers["user-agent"];

  let admin = readJSON("admin.json");
  const admins = admin.find((admin) => admin.email === email && admin.password === password);
  if (admins) {
    const token = createToken({
      id: 1,
      email: admin.email,
      role: "admin",
      browser: userAgent,
    });
    return res.json({
      message: "Admin login successful",
      status: 200,
      role : "admin",
      token,
      names : admin[0].adminname,
      redirectUrl: "/admin.html",
    });
  }

  const employes = readJSON("employes.json");
  const employe = employes.find((e) => e.email === email && e.password === password);

  if (employe) {
    const token = createToken({
      id: employe.id,
      email: employe.email,
      role: "employe",
      browser: userAgent,
    });
    return res.json({
      message: "Employe login successful",
      status: 200,
      token,
      role: "employe",
      names : employe.username,
      redirectUrl: "/ishchi.html",
    });
  }

  const clients = readJSON("clients.json");
  const client = clients.find((c) => c.email === email && c.password === password);

  if (client) {
    const token = createToken({
      id: client.id,
      email: client.email,
      role: "client",
      browser: userAgent,
    });
    return res.json({
      message: "Client login successful",
      status: 200,
      role : "client",
      names : client.username ,
      token,
      redirectUrl: "/client.html",
    });
  }

  return res.status(404).json({ message: "User not found", status: 404 });
};
