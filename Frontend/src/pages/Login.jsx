import React from "react";
import { loginStyles as s } from "../assets/Styles";
import { ShieldCheck, UserRound } from "lucide-react";
function Login() {
  return (
    <div className={s.pageContainer}>
      <div className={s.mainCard}>
        <section className={s.infoPanel}>
          <span className={s.roleBadge}> College Role Login</span>
          <h1 className={s.infoTitle}>
            Choose admin or student first, then open the correct library panel.
          </h1>
          <p className={s.infoDescription}>
            Select the Role you wnat to enter, then login with matching account.
          </p>
          <div className={s.infoBoxesContainer}>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <UserRound size={16} />
                Student Sign In
              </p>
              <p className={s.infoBoxText}>
                Register a new Student Account using the "Create Account" Link
                to text student functionality with real data.
              </p>
            </div>
            <div className={s.infoBox}>
              <p className={s.infoBoxTitle}>
                <ShieldCheck size={16} />
                Admin Accesss
              </p>
              <p className={s.infoBoxText}>
                Log in using your registered admin account to access the
                administrative dashboard and catalog features.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}

export default Login;
