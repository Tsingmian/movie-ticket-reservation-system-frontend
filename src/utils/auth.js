// frontend/src/utils/auth.js
export function isLogin() {
  // 简单示例：检查 localStorage 是否有 token
  return !!localStorage.getItem("user");
}
