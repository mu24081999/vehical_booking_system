export const toDateInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const getEntityId = <T extends { _id: string }>(value: T | string) => {
  if (typeof value === "string") return value;
  return value._id;
};
