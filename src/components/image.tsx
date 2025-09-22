import { ImageField } from "@refinedev/antd"
import { Button, Image, Upload } from "antd"
import { get } from "lodash"
// import nookies from "nookies";
import { API_URL, TOKEN_KEY } from "../constants"
import { DeleteOutlined } from "@ant-design/icons"

export default function UploadFile({
  value,
  onChange,
  multiple,
  children,
  onDone,
}: any) {
  // const cookies = nookies.get();
  const fileList: any[] = []

  if (multiple) {
    const l = value || []
    l.forEach((v: any) => {
      fileList.push({
        uid: v.id,
        name: v.name,
        status: "done",
        url: API_URL + v.url,
        response: [v],
      })
    })
  } else {
    if (value) {
      fileList.push({
        uid: value.id,
        name: value.name,
        status: "done",
        url: API_URL + value.url,
        response: [value],
      })
    }
  }
  return (
    <div>
      <Upload
        style={{
          height: 20,
        }}
        name="files"
        action={`${API_URL}/api/upload`}
        listType="picture"
        headers={{
          Authorization: "Bearer " + localStorage.getItem(TOKEN_KEY),
        }}
        multiple={multiple}
        showUploadList={false}
        accept="image/*"
        onChange={(e) => {
          console.log(e)
          if (multiple) {
            const v = get(e, "fileList") as any
            if (v) {
              const out = v
                .filter((r: any) => r.response)
                .map((i: any) => i.response[0])
              onChange && onChange(out)
              if (out.length > 0) {
                onDone && onDone(out)
              }
            }
            return
          } else {
            const v = get(e, "file.response[0]")
            if (v) {
              onChange && onChange(v)
              onDone && onDone(v)
            }
          }
        }}
      >
        {children ? (
          children
        ) : (
          <p
            style={{
              minWidth: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
            }}
            className="ant-upload-text"
          >
            + Ảnh
          </p>
        )}
      </Upload>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {fileList.map((f) => (
          <div key={f.uid} style={{ position: "relative" }}>
            <Image src={f.url} height={60} />
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Button
                onClick={() => {
                  if (multiple) {
                    const out = (value || []).filter((i: any) => i.id !== f.uid)
                    onChange && onChange(out)
                  } else {
                    onChange && onChange(null)
                  }
                }}
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{
                  padding: "0 4px",
                  lineHeight: "12px",
                  height: 16,
                  minWidth: 16,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
