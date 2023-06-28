import { RenderProps } from "@/components/Details/props";
import { colors } from "@/util/color";
import { formatDate } from "@/util/format";
import { ColumnsType } from "antd/es/table";
import { capitalize, get, toLower } from "lodash";

export const requirementsColumns: ColumnsType<any> = [
  {
    title: "Code",
    key: "reqCode",
    dataIndex: "reqCode",
    width: 50,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
];

export const testCaseColumns: ColumnsType<any> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Last Executed",
    dataIndex: "lastExecutedAt",
    key: "lastExecutedAt",
    render: (value) => formatDate(value),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      return (
        <p style={{ color: get(colors, toLower(value)) }}>
          {capitalize(value)}
        </p>
      );
    },
  },
];

export const TestPlanFields = [
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
            id: "testPlanCode",
            title: "Test Plan Code",
            placeholder: "Enter Test Plan Code",
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
];
