import db from "../configs/Database.js";
import Users from "./UserModel.js";
import Tasks from "./TaskModel.js";
import Logs from "./LogModel.js";

Users.hasMany(Tasks, {foreignKey: "userId", onDelete:"CASCADE"});
Tasks.belongsTo(Users, {foreignKey: "userId"});

Tasks.hasMany(Logs, {foreignKey: "taskId", onDelete:"CASCADE"});
Logs.belongsTo(Tasks, {foreignKey: "taskId"});

Users.hasMany(Logs, {foreignKey: "userId", onDelete:"CASCADE"});
Logs.belongsTo(Users, {foreignKey: "userId"});

(async () => {
    try{
        await db.authenticate();
        console.log("Koneksi database berhasil!");

        await db.sync({alter: true});
        console.log("Semua tabel berhasil disinkronisasi");
    }catch(err){
        console.log(`Gagal Connect : ${err}`);
    }
})();

export {Users};