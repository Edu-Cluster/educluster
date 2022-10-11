import type { NextPage } from 'next';
import React from 'react';

const LoginPage: NextPage = () => {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 h-screen bg-gray-100 pattern-bg">
      <div className="w-[40%] min-w-[320px] h-[600px] rounded-lg input-mask">
        <div className="flex items-center justify-center w-full">
          <span>LOGO Placeholder</span>
        </div>
        <form>
          <div className="flex items-center justify-end w-full h-full flex-col">
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
        <div className="flex justify-around items-center lg:justify-around w-full flex-col flex-wrap lg:flex-row">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-2">Angemeldet bleiben</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <button
            className="w-[80%] lg:w-[40%] h-16 primary-button"
            type="submit"
          >
            Einloggen
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
