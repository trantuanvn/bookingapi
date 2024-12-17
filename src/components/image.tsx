import { ImageField } from "@refinedev/antd";
import { Button, Image, Upload } from "antd";
import { get } from "lodash";
// import nookies from "nookies";
import { API_URL, TOKEN_KEY } from "../constants";

export default function UploadFile({ value, onChange, multiple }: any) {
  // const cookies = nookies.get();
  const fileList: any[] = [];

  if (multiple) {
    (value || []).forEach((v: any) => {
      fileList.push({
        uid: v.id,
        name: v.name,
        status: "done",
        url: API_URL + v.url,
        response: [v],
      });
    });
  } else {
    if (value) {
      fileList.push({
        uid: value.id,
        name: value.name,
        status: "done",
        url: API_URL + value.url,
        response: [value],
      });
    }
  }
  return (
    <div>
      <Upload.Dragger
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
          console.log(e);
          if (multiple) {
            const v = get(e, "fileList") as any;
            if (v) {
              const out = v
                .filter((r: any) => r.response)
                .map((i: any) => i.response[0]);
              onChange && onChange(out);
            }
            return;
          } else {
            const v = get(e, "file.response[0]");
            if (v) {
              onChange && onChange(v);
            }
          }
        }}
      >
        <p style={{ minWidth: 60 }} className="ant-upload-text">
          + Ảnh
        </p>
      </Upload.Dragger>

      {fileList.map((f) => (
        <div key={f.uid}>
          <Image src={f.url} height={60} />
          <Button
            onClick={() => {
              onChange && onChange(null);
            }}
          >
            Xóa
          </Button>
        </div>
      ))}
    </div>
  );
}
