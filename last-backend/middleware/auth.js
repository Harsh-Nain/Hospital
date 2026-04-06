import jwt from "jsonwebtoken";

export const islogin = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };

        return next();
      } catch (err) {
        console.log("Access token expired");
      }
    }

    // 2️⃣ If access token expired → verify refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired" });
    }

    const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // create new access token
    const newAccessToken = jwt.sign(
      {
        id: decodedRefresh.id,
        email: decodedRefresh.email,
        role: decodedRefresh.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    req.user = {
      id: decodedRefresh.id,
      email: decodedRefresh.email,
      role: decodedRefresh.role,
    };

    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};