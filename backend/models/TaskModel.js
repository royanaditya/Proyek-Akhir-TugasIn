import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Tasks = db.define("Task",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

export default Tasks;