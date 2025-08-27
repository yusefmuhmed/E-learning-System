const adminModel = require("../../db/models/admin.model");
const teacherModel = require("../../db/models/teacher.model")
const myHelper = require("../util/helper");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");

class Admin {
    static createAdmin = async (req, res) => {
        try {
            if (req.body.password.length < 6)
                throw new Error("Password must be more than 6 characters");

            const adminData = new adminModel({
                ...req.body
            })



            await adminData.save();

            return myHelper.resHandler(
                res,
                200,
                true,
                adminData,
                "Admin added successfully"
            );

        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message);
        }
    }

    static enableTeacher = async (req, res) => {
        try {
            const { teacherId, enableFlag } = req.body;

            if (typeof enableFlag !== "boolean") {
                throw new Error("enableFlag must be true or false");
            }


            const isExist = await teacherModel.findOne({ _id: teacherId });

            if (!isExist) throw new Error("Teacher does not exist");

            // update teacher account status
            const updatedTeacher = await teacherModel.findOneAndUpdate(
                { _id: teacherId },
                { isAccountEnabled: enableFlag },
                { new: true }
            );



            if (updatedTeacher) {
                await myHelper.accountStatusEmail(updatedTeacher.email, enableFlag);
            }


            return myHelper.resHandler(
                res,
                200,
                true,
                updatedTeacher,
                "Teacher account status changed successfully"
            );

        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message);
        }
    };

    static enableTeachers = async (req, res) => {
        try {
            const { teacherIds, enableFlag } = req.body;


            if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
                throw new Error("teacherIds must be a non-empty array");
            }
            if (typeof enableFlag !== "boolean") {
                throw new Error("enableFlag must be true or false");
            }


            const existingTeachers = await teacherModel.find({ _id: { $in: teacherIds } });

            if (existingTeachers.length === 0) {
                throw new Error("No teachers found with the given IDs");
            }


            const result = await teacherModel.updateMany(
                { _id: { $in: teacherIds } },
                { $set: { isAccountEnabled: enableFlag } }
            );

            const emailPromises = existingTeachers.map((teacher) =>
                myHelper.accountStatusEmail(teacher.email, enableFlag)
                    .then(() => {
                        console.log(`📧 Email sent to ${teacher.email}`);
                    })
                    .catch((err) => {
                        console.error(`❌ Failed to send email to ${teacher.email}:`, err.message);
                    })
            );

            await Promise.all(emailPromises);


            return myHelper.resHandler(
                res,
                200,
                true,
                { matched: result.matchedCount, modified: result.modifiedCount },
                "Teacher account statuses updated successfully"
            );

        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message);
        }
    };



    static login = async (req, res) => {
        try {
            console.log("test login")
            const adminData = await adminModel.loginAdmin(
                req.body.username,
                req.body.password
            );
            console.log(adminData);
            const token = await adminData.generateToken();

            console.log(token);
            myHelper.resHandler(res, 200, true, { adminData, token }, "Login Successfully");
        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message);
        }
    }

    static logOut = async (req, res) => {
        try {
            req.admin.tokens = req.admin.tokens.filter(
                (t) => t.token != req.token
            );
            await req.admin.save();
            myHelper.resHandler(res, 200, true, null, "logged out");
        } catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message);
        }
    };
}

module.exports = Admin;