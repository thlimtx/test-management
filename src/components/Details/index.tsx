import { DetailsProps } from "./props";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import map from "lodash/map";
import { useState } from "react";
import {
  faFloppyDisk,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";

export const Details = (props: DetailsProps) => {
  const {
    className,
    data,
    title,
    fields,
    register,
    onPressSave,
    onPressCancel,
    editable,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  // todo: Login session

  const onPressEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    onPressCancel && onPressCancel();
  };

  const renderDetails = (item: any) => {
    const { title, register: curRegister, render, ...rest } = item;
    return (
      <div>
        <p className="text-fade text-xs my-1.5">{title}</p>
        {editable && isEditing && item.editable !== false ? (
          <TextInput
            defaultValue={data[item.id]}
            {...rest}
            register={register}
            registerOptions={curRegister}
          />
        ) : (
          <p>{isEmpty(data[item.id]) ? "-" : data[item.id]}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`flex-1 py-3 px-5 ${className}`}>
      <div className="flex flex-row justify-between items-center mb-3">
        <p className="text-2xl font-bold italic">{title}</p>
        {editable &&
          (isEditing ? (
            <div className="flex flex-row">
              <Button
                text="Cancel"
                className="mr-3 border-textPrimary"
                icon={faXmark}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onCancel}
              />
              <Button
                text="Save"
                className="border-textPrimary"
                icon={faFloppyDisk}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onPressSave}
              />
            </div>
          ) : (
            <Button
              text="Edit"
              className="border-textPrimary"
              icon={faPen}
              type="invert"
              textClassName="text-textPrimary"
              onPress={onPressEdit}
            />
          ))}
      </div>
      <div className="p-4 my-2 bg-primaryBg shadow">
        {map(fields, (item, index) => {
          const { render } = item;
          return (
            <div key={`input${index}`}>
              {render
                ? render({ data, isEditing, renderDetails })
                : renderDetails(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
