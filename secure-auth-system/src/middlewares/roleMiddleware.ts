import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types'; // Assuming UserRole is defined in your types

const roleMiddleware = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role; // Assuming req.user is populated by authMiddleware

        if (!userRole) {
            return res.status(403).json({ message: 'Access denied. No role found.' });
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};

export default roleMiddleware;