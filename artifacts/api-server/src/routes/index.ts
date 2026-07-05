import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { registrationsRouter, adminRouter, coursesRouter } from "./registrations";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/registrations", registrationsRouter);
router.use("/admin", adminRouter);
router.use("/courses", coursesRouter);

export default router;
