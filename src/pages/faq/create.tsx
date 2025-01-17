import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";

export const FAQCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical">
        <Row gutter={12}>
          <Col span={18}>
            <Form.Item
              label={"Title"}
              name={["title"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={"Order"}
              name={["order"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Content"}
              name="content"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <MDEditor data-color-mode="light" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
