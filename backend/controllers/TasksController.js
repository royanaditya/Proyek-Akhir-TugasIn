import Tasks from "../models/TaskModel";

// GET
async function getAllTask(req, res) {
  try {
    const userId = req.user.id;
    const response = await Tasks.findAll({
      where:{
        idUser: userId
      }
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// CREATE
async function addTask(req, res) {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.user.id;
    await Tasks.create({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      userId: userId
    });
    res.status(201).json({ msg: "Task Created" });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateTask(req, res){
  try{
    const updatedTask = req.body;
    const task = await Tasks.update(
      updatedTask,
      {
        where: {
          id : req.params.id,
          userId : req.user.id
        }
      }
    )

    if (!task) {
        return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.status(201).json({ msg: "Task Updated" });
  }catch(error){
    console.log(error.message);
  }
}
  
async function deleteTask(req, res){
  try{
    const taskId = req.params.id;
    const userId = req.user.id;
    const task = await Tasks.destroy(
      {
        where: {
          id: taskId,
          userId: userId
        }
      }
    )

    if (!task) {
        return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.status(201).json({ msg: "Task Deleted" });
  }catch(error){
    console.log(error.message);
  }
}

export { getAllTask, addTask, updateTask, deleteTask };
