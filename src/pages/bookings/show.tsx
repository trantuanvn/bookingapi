import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Card, Typography } from "antd";

const { Title } = Typography;

export const BookingShow = () => {
  const { query } = useShow({
    meta: {
      populate: ["user", "work-space"],
    },
  });
  const { data, isLoading } = query;

  return (
    <Show isLoading={isLoading} breadcrumb={false} headerButtons={[]}>
      <Card title="Booking Details"></Card>
    </Show>
  );
};
