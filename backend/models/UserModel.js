import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Users = db.define("User",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    picture:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    refresh_token:{
        type: DataTypes.STRING,
        allowNull: true,
    }
});

export default Users;