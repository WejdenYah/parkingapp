import jwt from "jsonwebtoken";
import { createError } from "../utils/errors.js";
import Role from "../models/role.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyRole = (roleName) => {
  return async (req, res, next) => {
    verifyToken(req, res, async () => {
      try {
        const userRole = await Role.findById(req.user.role);
        if (userRole && userRole.name === roleName) {
          next();
        } else {
          return next(createError(403, "You are not authorized!"));
        }
      } catch (err) {
        next(err);
      }
    });
  };
};
