"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppStore } from "@/src/store";
import {
  Bell,
  Check,
  User,
  Settings,
  Lock,
  CircleAlert,
  Shield,
  Mail,
  Trash2,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import ContactSection from "./ContactSection";
import PasswordChangeForm from "./PasswordChangeForm";

function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || '').trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

export function SettingsView() {
  const { user, logout, addNotification, authMethod, authPhoneCountryCode } =
    useAppStore();

  const { firstName, lastName } = parseName(user?.name || '');

  const [activeTab, setActiveTab] = useState<
    'account' | 'contact' | 'security' | 'privacy' | 'alerts' | 'danger'
  >('account');

  const [privacy, setPrivacy] = useState<
    'public' | 'private' | 'invite_only'
  >('invite_only');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleProfileSave = async (data: {
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    await new Promise((r) => setTimeout(r, 600));
    addNotification(
      'success',
      'Профайл шинэчлэгдлээ',
      `${data.firstName} ${data.lastName} — амжилттай хадгаллаа.`,
    );
  };

  const handleEmailSave = async (data: { email: string }) => {
    await new Promise((r) => setTimeout(r, 600));
    addNotification('success', 'И-мэйл шинэчлэгдлээ', data.email);
  };

  const handlePhoneSave = async (data: {
    phone: string;
    countryCode: string;
  }) => {
    await new Promise((r) => setTimeout(r, 600));
    addNotification(
      'success',
      'Утасны дугаар шинэчлэгдлээ',
      `${data.countryCode} ${data.phone}`,
    );
  };

  const handlePasswordChange = async () => {
    await new Promise((r) => setTimeout(r, 800));
    addNotification('success', 'Нууц үг солигдлоо', 'Амжилттай шинэчлэгдлээ.');
  };

  const executeDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteInput.trim().toUpperCase() !== 'DELETE') {
      setDeleteError(
        'Баталгаажуулахын тулд "DELETE" гэж яг таг бичнэ үү.',
      );
      return;
    }

    addNotification(
      'warn',
      'Бүртгэл цуцлагдлаа',
      'Хэрэглэгчийн акаунт болон түүхэн архивуудыг системээс устгалаа.',
    );
    logout();
  };

  const tabs = [
    { key: 'account', icon: User, label: 'Хувийн Мэдээлэл' },
    { key: 'contact', icon: Mail, label: 'Холбоо Барих' },
    { key: 'security', icon: Lock, label: 'Нууц үг' },
    { key: 'privacy', icon: Shield, label: 'Нууцлал ба Хандалт' },
    { key: 'alerts', icon: Bell, label: 'Мэдэгдэл' },
    { key: 'danger', icon: CircleAlert, label: 'Бүртгэл устгах' },
  ] as const;

  return (
    <div
      id="settings-workspace"
      className="max-w-6xl mx-auto space-y-8 select-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b-2 border-bronze/20">
        <div>
          <h2 className="text-3xl font-display font-medium text-[#3D2B1F] flex items-center gap-3">
            <Settings className="w-7 h-7 text-bronze stroke-[1.5]" /> Тохиргоо
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-1">
          <p className="text-[10px] text-stone-400 font-bold tracking-wider uppercase px-3 pb-2 border-b border-stone-200/50 mb-2">
            Тохиргооны Цэс
          </p>

          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all relative ${
                activeTab === key
                  ? key === 'danger'
                    ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                    : 'bg-pine text-vellum shadow-md'
                  : key === 'danger'
                    ? 'text-red-650 hover:bg-red-50/50'
                    : 'text-[#3D2B1F]/85 hover:bg-pine/5 hover:text-ink'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  key === 'danger' ? 'text-red-500' : 'text-bronze'
                }`}
              />
              <span>{label}</span>
              {activeTab === key && key !== 'danger' && (
                <motion.div
                  layoutId="activeDot"
                  className="w-1.5 h-1.5 bg-bronze rounded-full absolute right-3 shrink-0"
                />
              )}
              {activeTab === key && key === 'danger' && (
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full absolute right-3 shrink-0" />
              )}
            </button>
          ))}

          <div className="pt-6 border-t border-stone-200/50 mt-6 space-y-3 px-3 text-[10px] text-stone-400">
            <div className="flex justify-between items-center">
              <span>Зай ашиглалт</span>
              <span className="font-mono text-[#3D2B1F]/70">
                1.2 GB / 10 GB
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'account' && (
            <ProfileSection
              initialFirstName={firstName}
              initialLastName={lastName}
              initialUsername={user?.username || ''}
              onSave={handleProfileSave}
            />
          )}

          {activeTab === 'contact' && (
            <ContactSection
              initialEmail={user?.email || ''}
              initialPhone=""
              initialCountryCode={authPhoneCountryCode || '+976'}
              emailVerified={false}
              phoneVerified={false}
              authMethod={authMethod}
              onEmailSave={handleEmailSave}
              onPhoneSave={handlePhoneSave}
            />
          )}

          {activeTab === 'security' && (
            <PasswordChangeForm onChangePassword={handlePasswordChange} />
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6"
            >
              <div className="pb-4 border-b border-stone-200/50 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-ink">
                    Нууцллал Хяналт
                  </h3>
                </div>
                <Shield className="w-5 h-5 text-bronze/80" />
              </div>

              <div className="space-y-4">
                <span className="text-[11px] text-stone-400 font-sans font-bold uppercase block">
                  Аюулгүй холбоосын хандалтын түвшин
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      key: 'private',
                      icon: Lock,
                      label: 'Бүрэн Нууцлал',
                      desc: 'Зөвхөн шууд уригдсан хувийн эзэмшигчид хандана',
                    },
                  
                    {
                      key: 'invite_only',
                      icon: Users,
                      label: 'Урилга код заавал',
                      desc: 'Нэвтрэх урилга код бүхий гэр бүлүүд хандана',
                    },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <div
                      key={key}
                      onClick={() =>
                        setPrivacy(key as typeof privacy)
                      }
                      className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all relative ${
                        privacy === key
                          ? 'bg-pine/5 border-ink text-ink'
                          : 'bg-white border-stone-150 hover:bg-stone-50/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-bronze" />
                      <p className="font-bold text-xs">{label}</p>
                      <span className="text-[10px] text-stone-400 block pt-1 leading-snug">
                        {desc}
                      </span>
                      {privacy === key && (
                        <Check className="w-4 h-4 bg-pine text-white rounded-full p-0.5 absolute top-2 right-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6"
            >
              <div className="pb-4 border-b border-stone-200/50 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-ink">
                    Шуурхай Мэдэгдэл ба Харилцаа холбоо
                  </h3>
                  <p className="text-[11px] text-stone-400 font-sans">
                    Овгийн сүлжээнд шинэчлэгдэж буй нандин баримтуудын
                    мэдээг хүлээн авах суваг.
                  </p>
                </div>
                <Bell className="w-5 h-5 text-bronze/80" />
              </div>

              <div className="space-y-5">
                <span className="text-[11px] text-stone-400 font-sans font-bold uppercase block">
                  Мэдэгдлийн идэвхтэй зангилаа
                </span>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Цахим Шуудан (Email Alerts)',
                      desc: 'Ургийн бичигт өөрчлөлт орох, шинэ скан зураг хавсаргахад и-мэйл мэдэгдэл илгээх.',
                      value: emailAlerts,
                      setter: setEmailAlerts,
                    },
                    {
                      label: 'Системийн мэдээ (In-App notifications)',
                      desc: 'Дашбоард, түүхэн цагийн хэлхээ хуудсанд шинэ мэдэгдэл идэвхтэй сонордуулах.',
                      value: inAppAlerts,
                      setter: setInAppAlerts,
                    },
                  ].map(({ label, desc, value, setter }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-4 bg-stone-50 border border-stone-150 rounded-xl leading-normal"
                    >
                      <div className="space-y-0.5 max-w-[80vw]">
                        <p className="font-bold text-xs text-ink">{label}</p>
                        <p className="text-[10px] text-stone-500">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setter(!value)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 focus:outline-none ${
                          value ? 'bg-bronze' : 'bg-stone-300'
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 bg-white rounded-full shadow"
                          animate={{ x: value ? 20 : 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'danger' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-6"
            >
              <div className="pb-4 border-b border-red-200/50 flex justify-between items-center text-red-700">
                <div>
                  <h3 className="font-display font-bold text-lg">
                    Аюултай Өөрчлөлтийн Бүс
                  </h3>
                  <p className="text-[11px] text-stone-400 font-sans">
                    Энэ хэсгийн үйлдлүүд нь буцаах боломжгүй бөгөөд
                    сэргээгдэхгүй болохыг анхаарна уу.
                  </p>
                </div>
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>

              <div className="p-4 bg-red-50 border border-red-150 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <CircleAlert className="w-4.5 h-4.5 shrink-0" />
                  <span>Ургийн түүхэн өгөгдлийг бүрмөсөн арилгах</span>
                </div>
                <p className="text-[11.5px] text-red-800 leading-relaxed font-medium">
                  Та өөрийн бүртгэлийг устгаснаар үүсгэсэн бүх овгийн
                  зангилаа, түүхэн скан баримтууд, холбоо хамаарлууд болон
                  цахим цаг дахь овгийн хэлхээ СЭРГЭЭХ БОЛОМЖГҮЙ-гээр бүр
                  хуудаснаас цуцлагдана.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs inline-flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    <Trash2 className="w-4 h-4" /> Бүртгэлээ бүрмөсөн цуцлах
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 border border-red-200 bg-white rounded-xl space-y-4 text-xs font-semibold"
                  >
                    <div className="flex justify-between items-center text-red-800">
                      <span>Аюултай үйлдлийг баталгаажуулна уу</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput('');
                          setDeleteError(null);
                        }}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-stone-600 leading-relaxed font-sans font-normal">
                      Үнэхээр архивыг устгахыг хүссэн хэвээр бол дор харагдах
                      сувагт заавал яг таг{' '}
                      <b className="text-[#3D2B1F] bg-stone-100 px-1 py-0.5 rounded font-mono">
                        DELETE
                      </b>{' '}
                      гэж оруулан баталгаажуулна уу.
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Хайрцагт зааврын дагуу бичих..."
                        className="w-full sm:w-80 bg-stone-50 border border-red-200 p-2.5 rounded-lg font-bold text-xs focus:ring-1 focus:ring-red-400 outline-none text-center block"
                      />
                      {deleteError && (
                        <span className="text-red-600 text-[10px] block font-bold">
                          ● {deleteError}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={executeDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer font-sans"
                    >
                      Үйлдэл гүйцэтгэх
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
