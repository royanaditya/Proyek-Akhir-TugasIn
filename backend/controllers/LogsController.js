import Logs from "../models/LogModel.js";

// GET logs berdasarkan taskId
export const getAllLogs = async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId) return res.status(400).json({ msg: "taskId diperlukan" });

    const response = await Logs.findAll({
      where: { taskId }
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Gagal ambil logs:", error.message);
    res.status(500).json({ msg: "Gagal mengambil logs" });
  }
};

// CREATE log baru
export const addLogs = async (req, res) => {
  try {
    const { description, date, taskId } = req.body;
    
    // 🔍 DEBUG: Cek isi req.user
    console.log("🔍 req.user:", req.user);
    console.log("🔍 req.body:", req.body);
    
    // ✅ Ambil userId dari token JWT (menggunakan "id" dari payload)
    const userId = req.user.id;
    
    console.log("🔍 userId yang diperoleh:", userId);
    
    if (!userId) {
      console.log("❌ userId tidak ditemukan di token");
      return res.status(401).json({ msg: "Token tidak valid atau userId tidak ditemukan" });
    }

    if (!description || !date || !taskId) {
      return res.status(400).json({ msg: "description, date, dan taskId diperlukan" });
    }

    console.log("🔍 Data yang akan disimpan:", {
      description,
      logDate: date,
      userId,
      taskId
    });

    const newLog = await Logs.create({
      description,
      logDate: date,
      userId,
      taskId
    });
    
    console.log("✅ Log berhasil dibuat:", newLog.toJSON());
    
    res.status(201).json({ msg: "Log berhasil ditambahkan", data: newLog });
  } catch (error) {
    console.error("❌ Gagal tambah log:", error.message);
    console.error("❌ Stack trace:", error.stack);
    res.status(500).json({ msg: "Gagal menambahkan log" });
  }
};

// UPDATE log
export const updateLogs = async (req, res) => {
  try {
    const { id, description, date, taskId } = req.body;
    
    // ✅ Ambil userId dari token JWT (menggunakan "id" dari payload)
    const userId = req.user.id;
    
    if (!id) return res.status(400).json({ msg: "ID log diperlukan" });
    if (!userId) return res.status(401).json({ msg: "Token tidak valid" });

    const updated = await Logs.update(
      {
        description,
        logDate: date,
        taskId,
        userId // ✅ Gunakan userId dari token
      },
      {
        where: { id }
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ msg: "Log tidak ditemukan" });
    }

    res.status(200).json({ msg: "Log berhasil diupdate" });
  } catch (error) {
    console.error("❌ Gagal update log:", error.message);
    res.status(500).json({ msg: "Gagal mengupdate log" });
  }
};

// DELETE log
export const deleteLogs = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ msg: "ID log diperlukan" });

    const deleted = await Logs.destroy({
      where: { id }
    });

    if (deleted === 0) {
      return res.status(404).json({ msg: "Log tidak ditemukan" });
    }

    res.status(200).json({ msg: "Log berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal hapus log:", error.message);
    res.status(500).json({ msg: "Gagal menghapus log" });
  }
};