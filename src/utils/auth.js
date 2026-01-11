// frontend/src/utils/auth.js
// export function isLogin() {
//   // 简单示例：检查 localStorage 是否有 token
//   return !!localStorage.getItem("user");
// }


export function isLogin() {
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const parsed = JSON.parse(user);
    return !!parsed && !!parsed.id;
  } catch {
    return false;
  }
}
