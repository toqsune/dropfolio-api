class Formatter {
  // Formats uptime
  static formatUptimeString(uptime) {
    let seconds = uptime;

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);

    seconds = Math.floor((seconds %= 60));

    const pad = (n) => String(n).padStart(2, "0");

    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }

  // Formats time string
  static formatTimeMilliseconds(value) {
    if (typeof value === "number") return value;

    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) return NaN;

    const num = Number(match[1]);
    const unit = match[2];

    const map = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return num * map[unit];
  }
}

export default Formatter;
