declare const router: import("express-serve-static-core").Router;
declare function mapDatabaseGameToShared(dbGame: any): any;
export default router;
export { router as gamesRouter };
export { mapDatabaseGameToShared };
