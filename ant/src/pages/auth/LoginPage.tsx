import React, { useState, useEffect } from 'react';
import { Form, Input, message, Card, Space, Button } from 'antd';
import { UserOutlined, LockOutlined, ReloadOutlined } from '@ant-design/icons';
import { authService, CaptchaResponse } from '../../services/authService';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [captcha, setCaptcha] = useState<CaptchaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // 初始化时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 刷新验证码
  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      // 传递验证码图片的宽度和高度参数
      // 宽度与验证码图片容器宽度一致（110px）
      // 高度与验证码图片容器高度一致（38px）
      const result = await authService.getCaptcha(110, 38);
      setCaptcha(result);
    } catch (error) {
      console.error('获取验证码失败:', error);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 登录表单提交处理
  const handleLogin = async (values: any) => {
    if (!captcha?.id) {
      message.error('请先获取验证码');
      return;
    }

    try {
      setLoading(true);

      const loginData = {
        username: values.username,
        password: values.password,
        captchaId: captcha.id,
        captchaCode: values.captcha,
      };
      const result = await authService.login(loginData);
      if (result.code === 0) {

        // 登录成功后，页面会被重定向到主页
        window.location.href = '/';
      } else {
        // 登录失败时先清空输入框，再获取新验证码
        // 使用 resetFields 更可靠地清空字段
        form.resetFields(['captcha']);
        await fetchCaptcha();
      }
    } catch (error) {
      console.error('登录发生错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 验证码图片点击事件
  const handleCaptchaClick = () => {
    if (!captchaLoading) {
      fetchCaptcha();
    }
  };

  return (
    <div className="login-page-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f2f5',
    }}>
      <Card title="管理系统登录" style={{ width: 400, borderRadius: 8 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{
            username: '',
            password: '',
            captcha: '',
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { whitespace: true, message: '用户名不能包含空格' },
              { max: 50, message: '用户名长度不能超过50个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 100, message: '密码长度必须在6-100个字符之间' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            label="验证码"
            rules={[
              { required: true, message: '请输入验证码' },
              { whitespace: true, message: '验证码不能包含空格' },
            ]}
          >
            <Space style={{ width: '100%' }}>
              <Input
                placeholder="请输入验证码"
                maxLength={6}
                style={{ width: '200px' }}
                inputMode="numeric"
                addonBefore=""
              />
              <div style={{ position: 'relative', width: 110, height: 38 }}>
                {captcha ? (
                  <img
                    src={captcha.base64}
                    alt="验证码"
                    style={{
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                    onClick={handleCaptchaClick}
                    onLoad={() => setCaptchaLoading(false)}
                    onError={() => {
                      setCaptchaLoading(false);
                      message.error('验证码加载失败');
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                      borderRadius: 4,
                    }}
                  >
                    加载中...
                  </div>
                )}
                {captchaLoading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                    }}
                  >
                    <ReloadOutlined spin size={16} />
                  </div>
                )}
              </div>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={loading}
              disabled={!captcha || captchaLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;