import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, getUser, logoutUser, createPost} from "../controllers/user.controller.js";
import { authAdmin, authUser } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/registeruser").post(upload.single('avatar'),registerUser);

router.route("/login").post(loginUser);

router.route("/post").post(upload.single('image'), authUser, createPost
);

router.route("/get-profile").get(authUser, getUser);

router.route("/logout").get(authUser, logoutUser)
export default router;
