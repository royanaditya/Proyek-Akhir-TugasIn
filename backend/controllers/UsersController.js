import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { username, password, confirm_password, date } = req.body;

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
      { id: user.id, username: user.username, birthDate: user.birthDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username, birthDate: user.birthDate },
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
      httpOnly: true, // <- Untuk keperluan PRODUCTION wajib true

      // sameSite:
      // - "strict": Cookie, hanya dikirim untuk request SAME SITE (domain yang sama)
      // - "lax": Cookie dikirim untuk navigasi GET antar domain (default)
      // - "none": Cookie dikirim untuk CROSS-SITE requests (butuh secure:true)
      sameSite: "lax", // <- Untuk API yang diakses dari domain berbeda

      // maxAge:
      // - Masa aktif cookie dalam milidetik (1 hari = 24x60x60x1000)
      // - Setelah waktu ini, cookie akan otomatis dihapus browser
      maxAge: 24 * 60 * 60 * 1000,

      // secure:
      // - `true`: Cookie hanya dikirim via HTTPS
      // - Mencegah MITM (Man-in-the-Middle) attack
      // - WAJIB `true` jika sameSite: "none"
      secure: false,
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