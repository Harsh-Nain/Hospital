export function FormatTime(time) {
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
};

export function getTimeRemaining(startTime, date) {
    if (!startTime || !date) return "";

    const now = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    const diff = start - now;

    if (diff <= 0) return "Started";

    const totalSeconds = Math.floor(diff / 1000);

    if (totalSeconds >= 86400) {
        const days = Math.floor(totalSeconds / 86400);
        return `Starts in ${days} day${days > 1 ? "s" : ""}`;
    }

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `Starts in ${hrs}h ${mins}m ${secs}s`;
}