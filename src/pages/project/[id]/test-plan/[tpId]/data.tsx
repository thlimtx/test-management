import { RenderDetailsProps } from "@/components/Details/props";
import { formatDate } from "@/util/format";
import { ColumnsType } from "antd/es/table";
import { toLower } from "lodash";

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
      const color = `text-${toLower(value)}`;
      return <p className={color}>{value}</p>;
    },
  },
];

export const TestPlanFields = [
  {
    render: ({ renderDetails }: RenderDetailsProps) => {
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
    render: ({ renderDetails, data }: RenderDetailsProps) => {
      const statusColor = `text-${toLower(data.status)}`;
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
          <div className={`flex flex-1 flex-col ${statusColor}`}>
            {renderDetails({
              id: "status",
              title: "Status",
              placeholder: "Enter Status",
              editable: false,
            })}
          </div>
        </div>
      );
    },
  },
];