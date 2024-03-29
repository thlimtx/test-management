import { DetailsProps, RenderDetailsProps } from "./props";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import map from "lodash/map";
import {
  faArrowLeft,
  faFloppyDisk,
  faPen,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { get, has, isEmpty } from "lodash";

export const Details = (props: DetailsProps) => {
  const {
    className,
    data = {},
    title,
    fields,
    register,
    onPressBack,
    onPressEdit,
    onPressSave,
    onPressCancel,
    onPressRun,
    editable,
    isEditing,
  } = props;

  /**
   * Render the default component for each field
   * @param item Each item in field props
   */
  const renderDetails = (item: RenderDetailsProps) => {
    const {
      title,
      register: curRegister,
      renderText,
      onChange,
      multiline,
      ...rest
    } = item;
    const dataValue = get(data, `${item.id}`);
    return (
      <div className="flex flex-1 flex-col">
        <p className="text-fade text-xs my-1.5">{title}</p>
        {editable && isEditing && item.editable !== false ? (
          multiline ? (
            <textarea
              className="w-full border border-opacity-100 rounded-sm text-sm px-3 py-1.5"
              rows={5}
              placeholder="Enter Description"
              id="description"
              defaultValue={data?.description}
              onChange={(e) => onChange && onChange(e as any)}
            />
          ) : (
            <TextInput
              defaultValue={dataValue}
              {...rest}
              register={register}
              registerOptions={curRegister}
            />
          )
        ) : (
          <div className="whitespace-pre-line">
            {renderText
              ? renderText(dataValue)
              : isEmpty(dataValue)
              ? "-"
              : dataValue}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex-1 py-3 px-5 ${className}`}>
      <div className="flex flex-row justify-between items-center mb-3">
        <p className="text-2xl font-bold italic">{title}</p>
        {isEditing ? (
          <div className="flex flex-row">
            <Button
              text="Cancel"
              className="mr-3 border-textPrimary"
              icon={faXmark}
              type="invert"
              textClassName="text-textPrimary"
              onPress={onPressCancel}
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
          <div className="flex flex-row">
            {has(props, "onPressBack") && (
              <Button
                text="Back"
                className="border-textPrimary"
                icon={faArrowLeft}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onPressBack}
              />
            )}
            {editable && (
              <Button
                text="Edit"
                className="ml-3 border-textPrimary"
                icon={faPen}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onPressEdit}
              />
            )}
            {has(props, "onPressRun") && (
              <Button
                text="Run"
                className="ml-3 border-textPrimary"
                icon={faPlay}
                type="invert"
                textClassName="text-textPrimary"
                onPress={onPressRun}
              />
            )}
          </div>
        )}
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
