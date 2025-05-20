import db from "../configs/Database.js";
import Users from "./UserModel.js";

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