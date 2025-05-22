import Logs from "../models/LogModel";

// GET
async function getAllLogs(req, res) {
  try {
    const taskId = req.body;
    const response = await Logs.findAll({
      where:{
        taskId: taskId
      }
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// CREATE
async function addLogs(req, res) {
  try {
    const { description, date, taskId } = req.body;
    const idUser = req.user.id;
    await Logs.create({
      description: description,
      logDate: date,
      idUser: idUser,
      taskId: taskId
    });
    res.status(201).json({ msg: "Logs Created" });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateLogs(req, res){
  try{
    const updatedLogs = req.body;
    const logs = await Logs.update(
      updatedLogs,
      {
        where: {
          id : req.params.id,
          userId : req.user.id
        }
      }
    )

    if (!logs) {
        return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(201).json({ msg: "Logs Updated" });
  }catch(error){
    console.log(error.message);
  }
}
  
async function deleteLogs(req, res){
  try{
    const logsId = req.params.id;
    const userId = req.user.id;
    await Logs.destroy(
      {
        where: {
          id: logsId,
          userId: userId
        }
      }
    )
    res.status(201).json({ msg: "Logs Deleted" });
  }catch(error){
    console.log(error.message);
  }
}

export { getAllLogs, addLogs, updateLogs, deleteLogs };
