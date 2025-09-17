import React, { useState } from 'react';
import { useUser } from './UserContext';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgotPassword' | 'forgotPasswordSent'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useUser();

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchView = (targetView: 'login' | 'signup' | 'forgotPassword') => {
    clearForm();
    setView(targetView);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password); // Password is not actually checked in this mock
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulate sending email
      setView('forgotPasswordSent');
    } else {
      setError('กรุณากรอกอีเมลของคุณ');
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      // This is a mock login. In a real app, this would trigger the Google OAuth flow.
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Try to sign up or log in the Google user
      try {
        await signup('Google User', 'google.user@example.com', 'google_password');
      } catch (e) {
        // If signup fails (e.g., user exists), just log them in
        await login('google.user@example.com', 'google_password');
      }
      onClose();
    } catch (err) {
       setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderTitle = () => {
    switch(view) {
      case 'login': return 'เข้าสู่ระบบสมาชิก';
      case 'signup': return 'สมัครสมาชิก';
      case 'forgotPassword': return 'ลืมรหัสผ่าน';
      case 'forgotPasswordSent': return 'ส่งคำขอสำเร็จ';
    }
  };
  
  const renderContent = () => {
    if (view === 'forgotPasswordSent') {
      return (
        <div className="text-center">
            <p className="text-gray-600 mb-6">หากมีบัญชีที่ผูกกับอีเมล <span className="font-semibold text-teal-600">{email}</span> คุณจะได้รับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
            <button
                onClick={() => switchView('login')}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors"
            >
                กลับไปหน้าเข้าสู่ระบบ
            </button>
        </div>
      );
    }
    
    return (
      <>
      {view === 'login' && (
          <p className="text-gray-500 mb-6">
              เข้าสู่ระบบเพื่อรับสิทธิพิเศษมากมาย!
          </p>
      )}
      {view === 'signup' && (
          <p className="text-gray-500 mb-6">
              สร้างบัญชีใหม่เพื่อเริ่มช้อปปิ้งได้เลย
          </p>
      )}
      {view === 'forgotPassword' && (
           <p className="text-gray-500 mb-6">
              กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
          </p>
      )}
      
      <form onSubmit={view === 'login' ? handleLoginSubmit : view === 'signup' ? handleSignupSubmit : handleForgotSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {view === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#004D40] mb-1">ชื่อผู้ใช้</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition"
                placeholder="เช่น somchai" required autoFocus />
            </div>
        )}

        {(view === 'login' || view === 'signup' || view === 'forgotPassword') && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#004D40] mb-1">อีเมล</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition"
                placeholder="somchai@example.com" required autoFocus={view !== 'signup'} />
            </div>
        )}
        
        {(view === 'login' || view === 'signup') && (
            <div>
              <div className="flex justify-between items-baseline">
                <label htmlFor="password"className="block text-sm font-medium text-[#004D40] mb-1">รหัสผ่าน</label>
                {view === 'login' && <span onClick={() => switchView('forgotPassword')} className="text-xs text-teal-600 hover:underline cursor-pointer">ลืมรหัสผ่าน?</span>}
              </div>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition"
                placeholder="••••••••" required />
            </div>
        )}
        
        {view === 'signup' && (
           <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-[#004D40] mb-1">ยืนยันรหัสผ่าน</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#374151] text-white placeholder-gray-400 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C69] focus:border-transparent transition"
                placeholder="••••••••" required />
          </div>
        )}
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-[#FF8C69] text-white font-bold py-3 px-6 rounded-full hover:bg-[#ff7a55] transition-colors disabled:bg-[#ffac94] disabled:cursor-not-allowed">
            {isSubmitting ? 'กำลังดำเนินการ...' : view === 'login' ? 'เข้าสู่ระบบ' : view === 'signup' ? 'สมัครสมาชิก' : 'ส่งคำขอ'}
        </button>
      </form>
      
      { (view === 'login' || view === 'signup') && (
        <>
            <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">หรือ</span></div>
            </div>

            <button onClick={handleGoogleLogin} disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-wait">
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>กำลังเชื่อมต่อ...</span>
                    </>
                ) : (
                    <>
                        <GoogleIcon />
                        <span>{view === 'login' ? 'เข้าสู่ระบบด้วย Google' : 'สมัครสมาชิกด้วย Google'}</span>
                    </>
                )}
            </button>
        </>
      )}
      
      <div className="text-center mt-6 text-sm">
        {view === 'login' && <p>ยังไม่มีบัญชี? <span onClick={() => switchView('signup')} className="font-semibold text-teal-600 hover:underline cursor-pointer">สมัครสมาชิก</span></p>}
        {view === 'signup' && <p>มีบัญชีอยู่แล้ว? <span onClick={() => switchView('login')} className="font-semibold text-teal-600 hover:underline cursor-pointer">เข้าสู่ระบบ</span></p>}
        {view === 'forgotPassword' && <p>จำรหัสผ่านได้แล้ว? <span onClick={() => switchView('login')} className="font-semibold text-teal-600 hover:underline cursor-pointer">กลับไปเข้าสู่ระบบ</span></p>}
      </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="text-[#004D40]"><UserIcon /></div>
            <h2 className="text-2xl font-bold text-[#004D40]">{renderTitle()}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon /></button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};