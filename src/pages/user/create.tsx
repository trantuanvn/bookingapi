import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";
import UploadFile from "../../components/image";
import { useParams } from "react-router-dom";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      populate: ["role", "avatar"],
    },
  });
  const { id } = useParams();

  const { selectProps } = useSelect({
    resource: "users-permissions/roles",
    optionLabel: "name",
  });
  return (
    <Create
      saveButtonProps={{ ...saveButtonProps, children: "Lưu lại" }}
      breadcrumb={null}
      title="Tạo người dùng mới"
    >
      <Form
        style={{ width: "500px", margin: "auto" }}
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          role: formProps?.initialValues?.role?.id || 1,
        }}
        onFinish={(d: any) => {
          d.avatar = d.avatar?.id;
          if (formProps.onFinish) {
            formProps.onFinish(d);
          }
        }}
      >
        <Form.Item
          label={"Tên đăng nhập"}
          name={["username"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"Tên đầy đủ"} name={["fullName"]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Số điện thoại"} name={["phoneNumber"]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={"Avatar"}
          name={["avatar"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <UploadFile />
        </Form.Item>
        {!id && (
          <>
            <Form.Item
              label={"Email"}
              name={["email"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="email" />
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
          </>
        )}
        <Form.Item
          label={"Chức danh"}
          name={["role"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...selectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
};
