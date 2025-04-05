export const formatDate = (date) => {
    const now = new Date(date);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const actionDate = (date) => {
    const now = new Date(date);
    return `${now.getFullYear() } -${ String(now.getMonth() + 1).padStart(2, "0") } -${ String(now.getDate()).padStart(2, "0") }`;
};

// export {actionDate, formatDate};
