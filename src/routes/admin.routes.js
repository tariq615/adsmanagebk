import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerAdmin, loginAdmin, getAdmin, logoutAdmin, adminDashboardStats, createPost } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(registerAdmin);

router.route("/login").post(loginAdmin);


router.route("/post").post(authAdmin,upload.single('image'), createPost
);

router.route("/get-profile").get(authAdmin, getAdmin);

router.route("/logout").get(authAdmin, logoutAdmin)

router.route("/dashboardstats").post(adminDashboardStats);
export default router;
