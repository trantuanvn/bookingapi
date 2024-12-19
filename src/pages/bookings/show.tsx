import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const BookingShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["category"],
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading} breadcrumb={false} headerButtons={[]}>
     
    </Show>
  );
};
