//输入 00:00:05,510 
//输出 05:51
export default function formateTime(raw: string): string {
  // 分割输入字符串，提取时间部分
  const parts = raw.split(':');
  const secondsParts = parts[2].split(',');

  // 获取分钟和秒钟
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(secondsParts[0], 10);

  // 格式化输出
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}