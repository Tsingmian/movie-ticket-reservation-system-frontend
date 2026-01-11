// frontend/src/utils/auth.js
// export function isLogin() {
//   // 简单示例：检查 localStorage 是否有 token
//   return !!localStorage.getItem("user");
// }

// export function isLogin() {
//   try {
//     const user = localStorage.getItem("user");
//     if (!user) return false;

//     const parsed = JSON.parse(user);
//     return !!parsed && !!parsed.id;
//   } catch {
//     return false;
//   }
// }

// export function isLogin() {
//   try {
//     const user = localStorage.getItem("user");
//     if (!user) return false;

//     const parsed = JSON.parse(user);
//     // 确保 role 和 id 都存在
//     return !!parsed && !!parsed.id && !!parsed.role;
//   } catch {
//     return false;
//   }
// }

export function isLogin() {
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;
    const parsed = JSON.parse(user);
    return !!parsed && !!parsed.id && !!parsed.role;
  } catch {
    return false;
  }
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}
