import Tasks from "../models/TaskModel.js";

export const getAllTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await Tasks.findAll({
      where: { userId }
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Gagal ambil tugas:", error);
    res.status(500).json({ msg: "Gagal mengambil data tugas" });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;
    const userId = req.user.id;

    await Tasks.create({
      title,
      description,
      startDate,
      endDate,
      status: status || "To Do",
      userId
    });

    res.status(201).json({ msg: "Task berhasil dibuat" });
  } catch (error) {
    console.error("❌ Gagal tambah tugas:", error);
    res.status(500).json({ msg: "Gagal membuat tugas" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id, title, description, startDate, endDate, status } = req.body;
    const userId = req.user.id;

    if (!id) return res.status(400).json({ msg: "ID tidak boleh kosong" });

    const [updated] = await Tasks.update(
      { title, description, startDate, endDate, status },
      { where: { id, userId } }
    );

    if (updated === 0) {
      return res.status(404).json({ msg: "Tugas tidak ditemukan atau bukan milik Anda" });
    }

    res.status(200).json({ msg: "Tugas berhasil diperbarui" });
  } catch (error) {
    console.error("❌ Gagal update tugas:", error.message);
    res.status(500).json({ msg: "Gagal update tugas" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.query.id;
    const userId = req.user.id;

    if (!taskId) {
      return res.status(400).json({ msg: "ID tidak ditemukan" });
    }

    const deleted = await Tasks.destroy({
      where: { id: taskId, userId }
    });

    if (deleted === 0) {
      return res.status(404).json({ msg: "Tugas tidak ditemukan atau bukan milik Anda" });
    }

    res.status(200).json({ msg: "Tugas berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal hapus tugas:", error.message);
    res.status(500).json({ msg: "Gagal menghapus tugas" });
  }
};

