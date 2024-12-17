import {
  Create,
  useDrawerForm,
  useForm,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import UploadFile from "../../components/image";
import { useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const RoomCreate = ({ disabled }: { disabled?: boolean }) => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      populate: ["room_group", "image"],
    },
  });
  const { id } = useParams();

  const { selectProps: categorySelectProps } = useSelect({
    resource: "room-groups",
    optionLabel: "name",
  });

  const {
    formProps: formSeatProps,
    drawerProps,
    saveButtonProps: saveSeatButtonProps,
    show,
    close,
  } = useDrawerForm({
    action: "create",
    resource: "seats",
  });

  const { tableProps } = useTable({
    resource: "seats",
    filters: {
      permanent: [
        {
          field: "room.documentId",
          value: id,
          operator: "eq",
        },
      ],
    },
  });

  return (
    <Create
      saveButtonProps={saveButtonProps}
      breadcrumb={null}
      title={id ? "Sửa" : "Tạo phòng mới"}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          room_group: formProps.initialValues?.room_group?.id,
        }}
        onFinish={(d: any) => {
          d.image = d.image.map((i: any) => i.id);
          if (formProps.onFinish) formProps.onFinish(d);
        }}
      >
        <Form.Item
          label={"Tên phòng"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Khu vực"}
          name={["room_group"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Hình ảnh"}
          name={["image"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <UploadFile multiple />
        </Form.Item>
        <Form.Item
          label={"Loại"}
          name={["type"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            options={[
              { value: "normal", label: "Phòng lớn (chưa các chỗ ngồi)" },
              { value: "meetting", label: "Phòng họp" },
            ]}
          />
        </Form.Item>
        {!!id && (
          <Card
            title="Danh sách ghế"
            extra={
              <Button
                onClick={() => {
                  show();
                }}
              >
                Add new
              </Button>
            }
            size="small"
          >
            <Table {...tableProps}>
              <Table.Column title="Tên" dataIndex="name" />
              <Table.Column title="Mã" dataIndex="code" />
              <Table.Column title="Trạng thái" dataIndex="status_code" />
              <Table.Column title="Loại" dataIndex="type" />
              <Table.Column title="Số ghế" dataIndex="quantity" />
              <Table.Column
                width={120}
                key="action"
                render={(a, b: any) => (
                  <Space size="small">
                    <Button
                      size="small"
                      onClick={() => {
                        show();
                      }}
                      icon={<EditOutlined />}
                    />
                    <Button
                      size="small"
                      danger
                      onClick={() => {
                        // delete
                      }}
                      icon={<DeleteOutlined />}
                    />
                  </Space>
                )}
              />
            </Table>
          </Card>
        )}
      </Form>

      <Drawer
        {...drawerProps}
        title={null}
        extra={<Button {...saveSeatButtonProps}>Tạo ghế mới</Button>}
      >
        <Form
          {...formSeatProps}
          layout="vertical"
          onFinish={(d: any) => {
            d.room = id;
            if (formSeatProps.onFinish) formSeatProps.onFinish(d);
          }}
        >
          <Form.Item
            label={"Tên"}
            name={["name"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name={["documentId"]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={"Mã"}
            name={["code"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Số ghế"}
            name={["quantity"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label={"Trạng thái"}
            name={["status_code"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                { value: "empty", label: "Trống" },
                { value: "using", label: "Đang sử dụng" },
                { value: "broken", label: "Hỏng" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={"Loại"}
            name={["type"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                { value: "desk", label: "Bình thường 1" },
                { value: "room", label: "Bình thường 2" },
                { value: "small", label: "Bình thường 3" },
                { value: "big", label: "Bình thường 4" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </Create>
  );
};
