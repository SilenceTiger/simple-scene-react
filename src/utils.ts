/**
 *
 * @param time 延迟函数
 * 使用方法
 * 在async函数体中使用 await delay(100)
 */
export function delay(time: number) {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export const clearScene = (obj: any) => {
  if (!obj) return;
  while (obj.children.length > 0) {
    clearScene(obj.children[0]);
    obj.remove(obj.children[0]);
  }
  if (obj.geometry) obj.geometry.dispose();
};
