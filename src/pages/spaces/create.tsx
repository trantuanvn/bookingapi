import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import UploadFile from "../../components/image";

export const SpaceCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create
      saveButtonProps={saveButtonProps}
      breadcrumb={null}
      title="Tạo khu vực mới"
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Tên khu vực"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
