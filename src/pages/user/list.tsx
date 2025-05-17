import {
  Create,
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Avatar, Button, Form, Input, Modal, Space, Table } from "antd";
import { API_URL } from "../../constants";

export const UserList = () => {
  const { tableProps, filters, setFilters } = useTable({
    syncWithLocation: true,
    meta: {
      populate: ["role", "avatar", "currentPlan"],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });
  const formModalPassword = useModalForm({
    resource: "users",
    action: "create",
    meta: {
      type: "reset-password",
    },
  });

  return (
    <List
      headerButtons={
        <Space>
          <Input.Search
            placeholder="Tìm kiếm"
            style={{ width: 300 }}
            onSearch={(value) => {
              setFilters([
                {
                  operator: "or",
                  value: [
                    {
                      field: "username",
                      operator: "contains",
                      value: value,
                    },
                    {
                      field: "phoneNumber",
                      operator: "contains",
                      value: value,
                    },
                  ],
                },
              ]);
            }}
          />
          <CreateButton
            children={<span style={{ fontSize: 14 }}>Tạo người dùng mới</span>}
          />
        </Space>
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={["avatar"]}
          title="Avatar"
          render={(r) => <Avatar src={API_URL + r?.url} />}
        />
        <Table.Column dataIndex="username" title={"Username"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column dataIndex="phoneNumber" title={"SĐT"} />
        <Table.Column dataIndex="fullName" title={"Tên đầy đủ"} />
        <Table.Column dataIndex={["role", "name"]} title={"Phân quyền"} />
        <Table.Column
          dataIndex={["currentPlan", "name"]}
          title={"Gói dịch vụ hiện tại"}
          render={(value: any) => <MarkdownField value={value} />}
        />

        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          width={100}
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <Button
                key="cancel"
                onClick={() => {
                  formModalPassword.show();
                  formModalPassword.formProps.form?.setFieldValue(
                    "email",
                    record.email
                  );
                }}
              >
                Cập nhật mật khẩu
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        {...formModalPassword.modalProps}
        width={600}
        title="Cập nhật mật khẩu"
      >
        <Form
          {...formModalPassword.formProps}
          layout="vertical"
          initialValues={{
            ...formModalPassword.formProps.initialValues,
            password: "",
            confirmPassword: "",
          }}
        >
          <Form.Item
            name={["email"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={"Mật khẩu"}
            name={["password"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={"Nhập lại mật khẩu"}
            name={["confirmPassword"]}
            dependencies={["password"]}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu không khớp, vui lòng nhập lại!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </List>
  );
};
