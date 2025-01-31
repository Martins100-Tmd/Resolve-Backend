import { signUp, login } from "../controller/admin";
import { Router } from "express";
import { authToken } from "../middleware/auth";
import { GetAllDetails } from "../controller/waitlist";
import { Admin } from "../middleware/rbac";


const router = Router()

router.post("/SignUp", signUp)
router.post("/login", login)
router.get("/get-all-users", authToken, Admin, GetAllDetails)

export default router