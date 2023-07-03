import { useState } from "react";
import { FormDropdownProps } from "./props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, MenuProps } from "antd";
import { capitalize } from "lodash";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const FormDropdown = (props: FormDropdownProps) => {
  const { id, title, options, onSelect, register, value } = props;

  const onSelectDropdown: MenuProps["onClick"] = ({ key }) => onSelect(id, key);
  return (
    <div>
      <p className="text-fade text-xs">{title}</p>
      <Dropdown
        menu={{
          items: options,
          onClick: onSelectDropdown,
        }}
        trigger={["click"]}
      >
        <a onClick={(e) => e.preventDefault()}>
          <div
            id={id}
            className={`flex flex-row items-center border border-opacity-100 rounded-sm w-full px-3 py-1.5 my-2 text-sm button`}
          >
            <input
              className="flex flex-1 button bg-primaryBg"
              {...register(id)}
              placeholder={`Select ${title}`}
              value={capitalize(value)}
              disabled
            />
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </a>
      </Dropdown>
    </div>
  );
};
