import { capitalize, map } from "lodash";

/**
 * Get dropdown option data type from enum
 * @param type enum type
 * @returns array of object with key and label attribute
 */
export const getDropdownOptionsbyType = (type: any) => {
  return map(type, (o) => {
    return {
      key: o,
      label: capitalize(o),
    };
  });
};
