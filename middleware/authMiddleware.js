// import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; // Adjust path if needed

// // 1. This is your existing function, renamed to 'protect'
// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.user = await User.findById(decoded.id).select('-password');

//             if (!req.user) {
//                 return res.status(401).json({ message: 'Not authorized, user not found' });
//             }

//             next(); // Proceed to the next middleware or controller

//         } catch (error) {
//             console.error('Token verification failed:', error.message);
//             res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token provided' });
//     }
// };

// // --- ADD THESE NEW FUNCTIONS ---

// // 2. SUPERADMIN CHECK
// // Checks if the logged-in user's role is 'superadmin'
// // This is the fixed code
// const superadmin = (req, res, next) => {
//     // --- THIS IS THE FIX ---
//     // We convert the role from the database to lowercase before checking it
//     const userRole = req.user ? req.user.role.toLowerCase() : '';

//     if (userRole === 'superadmin') {
//         next(); // The check will now pass
//     } else {
//         res.status(403);
//         throw new Error('Not authorized. Superadmin access only.');
//     }
// };

// // 3. COMPANY OWNER CHECK
// // Checks if the logged-in user's role is 'user' (Company Owner)
// const isCompanyOwner = (req, res, next) => {
//     if (req.user && req.user.role === 'user') {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('Not authorized. Company Owner access only.');
//     }
// };

// // 4. BUSINESS MEMBER CHECK
// // Checks if the user is EITHER 'user' (Owner) OR 'admin' (Employee)
// const isBusinessMember = (req, res, next) => {
//     if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
//         next();
//     } else {
//         res.status(403); // 403 Forbidden
//         throw new Error('Not authorized. Business member access only.');
//     }
// };


// // --- THIS IS THE MOST IMPORTANT CHANGE ---
// // Instead of exporting one function, we now export all of them as an object
// export { protect, superadmin, isCompanyOwner, isBusinessMember };

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER =>", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);
    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};

export const superadmin = (req, res, next) => {
  if (req.user?.role === "superadmin") {
    next();
  } else {
    return res.status(403).json({
      message: "Superadmin access only",
    });
  }
};

// ================= BUSINESS MEMBER =================
const isBusinessMember = (req, res, next) => {
  if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Business access only' });
  }
};

export {  isBusinessMember };
