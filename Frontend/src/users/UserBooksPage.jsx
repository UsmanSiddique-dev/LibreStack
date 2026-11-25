import React from "react";
import { userBooksPageStyles as s } from "../assets/Styles";
const UserBooksPage = () => {
  return (
    <div className={s.pageContainer}>
      <section className={s.heroSection}>
        <div className={s.heroFlex}>
          <div>
            <span className={s.heroBadge}>Students Books Page</span>
            <h1 className={s.heroTitle}>
              Book Cards with richer content and cleaner groupeddetails.
            </h1>
            <p className={s.heroText}>
              Each card now uses a clearer top summary , status badge, content
              chips, and a better medium-card layout so the details feel
              structured and and elegant.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default UserBooksPage;
