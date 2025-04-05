import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.TOKEN_KEY;

export const createToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, browser: user.browser },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    throw {
      status: 500,
      message: 'Token yaratishda xato yuz berdi',
      error: error.message
    };
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) { 
    if (err.name === 'JsonWebTokenError') {
      throw {
        status: 400,
        message: 'Invalid token format!',
        error: err.message
      };
    } else if (err.name === 'TokenExpiredError') {
      throw {
        status: 401,
        message: 'Tokenning muddati tugagan!',
        error: err.message
      };
    } else {
      throw {
        status: 500,
        message: 'Xatolik yuz berdi',
        error: err.message
      };
    }
  }
};
