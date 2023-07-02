import { capitalize, filter, includes, map, mapValues } from "lodash";

/**
 * Get dropdown option data type from enum
 * @param type enum type
 * @returns array of object with key and label attribute
 */
export const getDropdownOptionsbyType = (type: any, omit?: string[]) => {
  return map(
    filter(type, (o) => !includes(o, omit)),
    (o) => {
      return {
        key: o,
        label: capitalize(o),
      };
    }
  );
};

export const getFilter = (data: object) => {
  const filter = map(data, (item, key) => {
    return { [key]: { contains: item, mode: "insensitive" } };
  });
  return filter;
};
