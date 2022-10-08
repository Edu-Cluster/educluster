import type { NextPage } from 'next';
import React from 'react';

const LoginPage: NextPage = () => {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 h-screen bg-gray-100">
      <div className="w-[40%] min-w-[320px] h-[500px] rounded-lg input-mask">
        <div>
          <span>LOGO Placeholder</span>
        </div>
        <form>
          <div className="flex flex-col justify-center h-full items-center">
            <div className="input-box">
              <input type="text" autoComplete="email" required />
              <span>E-Mail Adresse</span>
            </div>
            <div className="input-box mt-5">
              <input type="text" required />
              <span>Benutzername</span>
            </div>
            <div className="input-box mt-5">
              <input type="password" required />
              <span>Passwort</span>
            </div>
          </div>
        </form>
        <div className="w-full flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-2">Angemeldet bleiben</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <button className="w-[40%] h-16 primary-button" hidden type="submit">
            Einloggen
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
