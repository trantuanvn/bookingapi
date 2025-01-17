import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Col, Form, Input, Row, Select } from "antd";

export const PlanCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical">
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item
              label={"Name"}
              name={["name"]}
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
              label={"Code"}
              name={["code"]}
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
              label={"Price / Month"}
              name={["price"]}
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
              label={"Color"}
              name={["color"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="color" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Description"}
              name="description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
              {/* <MDEditor data-color-mode="light" /> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};