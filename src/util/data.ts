import { capitalize, filter, includes, map } from "lodash";

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
