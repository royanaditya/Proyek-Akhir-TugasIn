import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../configs/Cloudinary.js";
import streamifier from 'streamifier';

export const Register = async (req, res) => {
  const { username, password, confirm_password, gender, date } = req.body;

  // Password Validation
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  // Hash Password
  const hashPassword = await bcrypt.hash(password, 5);

  try {
    const data = await Users.create({
      username: username,
      password: hashPassword,
      gender: gender,
      birthDate: date
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // JWT Sign
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, gender:user.gender, birthDate: user.birthDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, gender:user.gender, birthDate: user.birthDate },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    console.log(refreshToken);

    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Set Cookie
    // Masukkin refresh token ke cookie
    res.cookie("refreshToken", refreshToken, {
      // httpOnly:
      // - `true`: Cookie tidak bisa diakses via JavaScript (document.cookie)
      // - Mencegah serangan XSS (Cross-Site Scripting)
      // - Untuk development bisa `false` agar bisa diakses via console
      httpOnly: false, // <- Untuk keperluan PRODUCTION wajib true

      // sameSite:
      // - "strict": Cookie, hanya dikirim untuk request SAME SITE (domain yang sama)
      // - "lax": Cookie dikirim untuk navigasi GET antar domain (default)
      // - "none": Cookie dikirim untuk CROSS-SITE requests (butuh secure:true)
      sameSite: "none", // <- Untuk API yang diakses dari domain berbeda

      // maxAge:
      // - Masa aktif cookie dalam milidetik (1 hari = 24x60x60x1000)
      // - Setelah waktu ini, cookie akan otomatis dihapus browser
      maxAge: 24 * 60 * 60 * 1000,

      // secure:
      // - `true`: Cookie hanya dikirim via HTTPS
      // - Mencegah MITM (Man-in-the-Middle) attack
      // - WAJIB `true` jika sameSite: "none"
      secure: true,
    });

    // Response
    return res.status(200).json({
      accessToken,
      message: "Login berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Sesuaikan nama cookie
    if (!refreshToken) return res.sendStatus(204); // No Content, berarti user sudah logout

    // User Validation
    const data = await Users.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!data) return res.status(204).json("User Tidak Ditemukan");

    // Mengupdate refresh token menjadi null
    await Users.update({ refresh_token: null }, { where: { id: data.id } });

    // Menghapus refresh cookie
    res.clearCookie("refreshToken", {
      httpOnly: false,
      sameSite: "none",
      secure: true,
      path: "/",          // kalau kamu tidak atur path sebelumnya, tambahkan saja
    }); // Sesuaikan nama cookie

    // Response
    return res.status(200).json({
      message: "Logout Berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await Tasks.findAll({
      where:{
        idUser: userId
      }
    });

    res.status(201).json({
      message: "Data Profile Berhasil Diambil!",
      response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Cek apakah user ada
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const { username, gender, birthDate } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (birthDate) updateData.birthDate = birthDate;
    if (gender) updateData.gender = gender;

    if (req.file) {
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer(req.file.buffer);
      updateData.picture = result.secure_url;
    }

    // Jalankan update menggunakan Sequelize
    await Users.update(updateData, {
      where: { id: userId },
    });

    // Ambil data terbaru setelah update
    const updatedUser = await Users.findByPk(userId, {
      attributes: ["id", "username", "gender", "birthDate", "picture"],
    });

    res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update profil", error: err.message });
  }
};

