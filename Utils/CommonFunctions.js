export const addQuotes = (str) => `'${str}'`;

export const convertUnixToDate = (unixTime) => {
  const date = new Date(unixTime);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}-${month}-${year}`;
};
