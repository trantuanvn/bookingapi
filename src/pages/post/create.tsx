import { Create, useForm, useSelect } from "@refinedev/antd"
import MDEditor from "@uiw/react-md-editor"
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd"
import dayjs from "dayjs"
import UploadFile from "../../components/image"

export const PostCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      populate: "*",
    },
  })

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form
        {...formProps}
        initialValues={{
          ...formProps?.initialValues,
          imageList: formProps?.initialValues?.images || [],
          bannerImage: formProps?.initialValues?.banner || null,
        }}
        layout="vertical"
        onFinish={(values: any) => {
          if (values.bannerImage) {
            values.banner = values.bannerImage.id
          }
          if (values.imageList) {
            values.images = (values.imageList || []).map((i: any) => i.id)
          }
          delete values.imageList
          delete values.bannerImage
          formProps?.onFinish?.(values)
        }}
      >
        <Row gutter={12}>
          <Col span={16}>
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
          <Col span={8}>
            <Form.Item
              label={"Date"}
              name={["date"]}
              getValueProps={(i) => ({ value: dayjs(i) })}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={"Description"}
              name={["description"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={"Nội dung"}
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

          <Col span={12}>
            <Form.Item label={"Banner"} name={["bannerImage"]}>
              <UploadFile multiple>
                <Button>Chọn ảnh</Button>
              </UploadFile>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={"Images"} name={["imageList"]}>
              <UploadFile multiple>
                <Button>Chọn ảnh</Button>
              </UploadFile>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  )
}
