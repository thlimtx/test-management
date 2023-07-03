import { colors } from "@/util/color";
import { formatDate, formatDuration } from "@/util/format";
import { ColumnsType } from "antd/es/table";
import { capitalize, get, toLower } from "lodash";

export const buildFields = [
  {
    id: "description",
    title: "Description",
    placeholder: "Enter Description",
  },
  {
    id: "script",
    title: "Script",
    placeholder: "Enter script",
  },
];

export const buildLogColumns: ColumnsType<any> = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "Duration (s)",
    dataIndex: "duration",
    key: "duration",
    render: (value) => formatDuration(value),
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
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
