import express from "express";
import upload from "../utils/multer.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse } from "../controller/course.controller.js";


const router = express.Router();
router.route("/search").get(isAuthenticated, searchCourse)
router.route("/published-courses").get( getPublishedCourse)
router.route("/").post(isAuthenticated, createCourse)
router.route("/").get(isAuthenticated, getCreatorCourses)
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"), editCourse)
router.route("/:courseId").get(isAuthenticated,getCourseById)
router.route("/:courseId/lecture").post(isAuthenticated,createLecture)
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture)
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture)
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture)
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById)
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse)

export default router;