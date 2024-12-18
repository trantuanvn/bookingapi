import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";
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

        <Form.Item
          label={"Mô tả"}
          name={["description"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        {/* <Form.Item
          label={"Hình ảnh"}
          name={["image"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <UploadFile />
        </Form.Item> */}

        <Form.Item
          label={"Chiều dài (cm)"}
          name={["height"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label={"Chiều rộng (cm)"}
          name={["width"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Create>
  );
};
