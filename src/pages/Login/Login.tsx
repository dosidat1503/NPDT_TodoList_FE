import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import Cookies from "js-cookie";
import request from "../../utils/request";
import { useNavigate } from "react-router-dom";

interface FieldType   {
  email?: string;
  password?: string;
  remember?: string;
};

interface SetTokenProps  {
  token: string;
  expiresIn: number;
  type: string;
}; 

interface Login {
  access_token: string;
  refresh_token: string;
  user: { 
    id: number;
    name: string;
    email: string;
  };
  expires_in_AccessToken: number;  
  expires_in_RefreshToken: number;  
};

export const setToken = ({token , expiresIn , type} : SetTokenProps )  => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000  
  );
  Cookies.set(type, token, {
    expires: expirationDate,
    secure: true,
    sameSite: "strict", 
  });
};
 

export default function Login() {
  const navigation = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    request
      .post<Login>("/api/login", { email: values.email, password: values.password })
      .then((response) => {
        const { access_token, refresh_token, user, expires_in_AccessToken, expires_in_RefreshToken } = response.data;
         
        setToken({
          token: access_token,
          expiresIn: expires_in_AccessToken,
          type: "accessToken",
        });
        setToken({
          token: refresh_token,
          expiresIn: expires_in_RefreshToken,
          type: "refreshToken",
        });
        console.log("Login success", response.data);
        localStorage.setItem("userInfo", JSON.stringify(user));
        navigation("/");
      })
      .catch((error) => {
        console.error("Login failed", error);
        throw error;
      });
  }; 
 
  return (
    <div className="h-96 w-96 ">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish} 
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
