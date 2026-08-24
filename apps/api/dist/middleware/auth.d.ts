import { Request, Response, NextFunction } from 'express';
declare const JWT_SECRET: string;
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireRoles(allowedRoles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { JWT_SECRET };
