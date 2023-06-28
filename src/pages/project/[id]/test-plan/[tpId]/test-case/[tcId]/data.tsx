import { RenderProps } from "@/components/Details/props";
import { colors } from "@/util/color";
import { capitalize, get, toLower } from "lodash";

export const testCaseFields = [
  {
    render: ({ renderDetails }: RenderProps) => {
      return (
        <div className="flex flex-row">
          {renderDetails({
            id: "title",
            title: "Title",
            placeholder: "Enter Title",
          })}
          <div className="flex flex-1" />
          {renderDetails({
            id: "testCaseCode",
            title: "Code",
            placeholder: "Enter Code",
          })}
        </div>
      );
    },
  },
  {
    id: "description",
    title: "Description",
    placeholder: "Enter Description",
  },
  {
    render: ({ renderDetails, data }: RenderProps) => {
      const statusColor = get(colors, toLower(data.status));
      return (
        <div className="flex flex-row">
          {renderDetails({
            id: "type",
            title: "Type",
            editable: false,
          })}
          {renderDetails({
            id: "priority",
            title: "Priority",
            editable: false,
          })}
          <div
            className={`flex flex-1 flex-col`}
            style={{ color: statusColor }}
          >
            {renderDetails({
              id: "status",
              title: "Status",
              editable: false,
              renderText: (text: any) => capitalize(text),
            })}
          </div>
        </div>
      );
    },
  },
  {
    render: ({ renderDetails }: RenderProps) => {
      return (
        <div className="flex flex-row justify-evenly">
          {renderDetails({
            id: "createdAt",
            title: "Created At",
            editable: false,
          })}
          {renderDetails({
            id: "lastExecutedAt",
            title: "Last Executed",
            placeholder: "Enter Last Executed Date",
            editable: false,
          })}
          <div className="flex flex-1"></div>
        </div>
      );
    },
  },
  {
    id: "precondition",
    title: "Precondition",
    placeholder: "Enter Precondition",
  },
  {
    id: "steps",
    title: "Steps",
    placeholder: "Enter Steps",
  },
  {
    id: "data",
    title: "Data",
    placeholder: "Enter Test Data",
  },
  {
    id: "expected",
    title: "Expected Result",
    placeholder: "Enter Expected Result",
  },
  {
    id: "script",
    title: "Test Script",
    placeholder: "Enter Test Script",
  },
  {
    id: "result",
    title: "Actual Result",
    placeholder: "Enter Actual Result",
  },
];
