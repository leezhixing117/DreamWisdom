import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'antd';
import { loginUser, registerUser, sendResetCode, resetPassword } from '@/services/dreamApi';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onCancel, onSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'error', text:string}|null>(null);
  const [form] = Form.useForm();

  const resetState = () => {
    setMsg(null);
    form.resetFields();
  };

  const switchMode = (m: Mode) => {
    resetState();
    setMode(m);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setMsg(null);
    try {
      if (mode === 'login') {
        const res = await loginUser(values.email, values.password);
        localStorage.setItem('token', res.token);
        setMsg({type:'success', text:'登入成功'});
        setTimeout(()=>{
          onSuccess();
          onCancel();
        }, 800);
      } else if (mode === 'register') {
        await registerUser(values.email, values.password);
        setMsg({type:'success', text:'註冊成功，請登入'});
        setTimeout(()=>switchMode('login'), 1200);
      } else if (mode === 'forgot') {
        await sendResetCode(values.email);
        setMsg({type:'success', text:'驗證碼已發送到你電郵'});
        setTimeout(()=>switchMode('reset'), 1200);
      } else if (mode === 'reset') {
        await resetPassword(values.email, values.code, values.newPassword);
        setMsg({type:'success', text:'密碼重設成功，請登入'});
        setTimeout(()=>switchMode('login'), 1200);
      }
    } catch (e: any) {
      setMsg({type:'error', text: e?.message || '操作失敗，請稍後再試'});
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(mode) {
      case 'login': return '登入';
      case 'register': return '註冊帳號';
      case 'forgot': return '忘記密碼';
      case 'reset': return '重設密碼';
    }
  };

  return (
    <Modal
      open={open}
      title={getTitle()}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      {msg && (
        <Alert
          message={msg.text}
          type={msg.type}
          showIcon
          style={{marginBottom:16}}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="電郵"
          name="email"
          rules={[{required:true, message:'請輸入電郵'}, {type:'email', message:'電郵格式錯誤'}]}
        >
          <input className="ant-input" type="email" placeholder="your@email.com"/>
        </Form.Item>

        {mode === 'login' && (
          <Form.Item
            label="密碼"
            name="password"
            rules={[{required:true, message:'請輸入密碼'}]}
          >
            <input className="ant-input" type="password" placeholder="密碼"/>
          </Form.Item>
        )}

        {mode === 'register' && (
          <>
            <Form.Item
              label="密碼"
              name="password"
              rules={[{required:true, message:'請設定密碼'}, {min:6, message:'密碼最少6位'}]}
            >
              <input className="ant-input" type="password" placeholder="設定密碼"/>
            </Form.Item>
            <Form.Item
              label="確認密碼"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {required:true, message:'請再次輸入密碼'},
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('兩次密碼唔一樣'));
                  }
                })
              ]}
            >
              <input className="ant-input" type="password" placeholder="確認密碼"/>
            </Form.Item>
          </>
        )}

        {mode === 'reset' && (
          <>
            <Form.Item
              label="驗證碼"
              name="code"
              rules={[{required:true, message:'請輸入電郵收到嘅驗證碼'}]}
            >
              <input className="ant-input" placeholder="6位數字驗證碼"/>
            </Form.Item>
            <Form.Item
              label="新密碼"
              name="newPassword"
              rules={[{required:true, message:'請輸入新密碼'}, {min:6, message:'密碼最少6位'}]}
            >
              <input className="ant-input" type="password" placeholder="新密碼"/>
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {mode === 'login' ? '登入'
              : mode === 'register' ? '註冊'
              : mode === 'forgot' ? '發送驗證碼'
              : '重設密碼'}
          </Button>
        </Form.Item>
      </Form>

      <div style={{textAlign:'center', marginTop:8}}>
        {mode === 'login' && (
          <>
            <Button type="link" onClick={()=>switchMode('register')}>未有帳號？註冊</Button>
            <Button type="link" onClick={()=>switchMode('forgot')}>忘記密碼</Button>
          </>
        )}
        {mode === 'register' && (
          <Button type="link" onClick={()=>switchMode('login')}>已有帳號？登入</Button>
        )}
        {(mode === 'forgot' || mode === 'reset') && (
          <Button type="link" onClick={()=>switchMode('login')}>返回登入</Button>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
